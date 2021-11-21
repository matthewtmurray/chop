import Device from '../models/device.model';
import jwt from 'jsonwebtoken';
import DeviceUpdate from '../models/deviceUpdate.model';
import UnclaimedDevice from '../models/unclaimedDevice.model';

///web client calls////////////////

//create
export const claimUnclaimedDevice = async (req,res)=>{
    const unclaimedDevice = await UnclaimedDevice.findOne({deviceId:req.body.deviceId, claimed:false});
    if (unclaimedDevice) {
        await UnclaimedDevice.updateOne({deviceId:req.body.deviceId},{claimed:true,tenant:req.user.tenant});
        const device = new Device({title:req.body.title, location: req.body.location, room: req.body.room, tenant: req.user.tenant,
        addedBy: req.user._id, deviceId: req.body.deviceId});
        console.log(`body: ${JSON.stringify(req.body)} user from token: ${JSON.stringify(req.user)}`);;
        await device.save();
        return res.status(200).send('device saved');
    }
    else{
        return res.status(400).send('unable to claim device');
    }
};

//read multiple
export const getDevices = async (req, res)=>{
    const devices = await Device.find({tenant: req.user.tenant}).exec();
    return res.status(200).send(devices);
};

//read single
export const getDevice = async (req, res)=>{
    const device = await Device.find({tenant: req.user.tenant, deviceId: req.params.id}).exec();
    if (device) {
        return res.status(200).send(device);
    }
    else{
        return res.status(404).send("Device not found");
    }
};

//update status
export const updateDevice = async (req,res)=>{
   console.log(`tenant ${req.user.tenant} deviceId ${req.body.deviceId}`);
   console.log(`tenant ${req.user.tenant} deviceId ${req.body.deviceId}`);
    const device = await Device.findOne({tenant:req.user.tenant, deviceId:req.body.deviceId});
    if (device == null) {
        return res.status(404).send("Device not found");
    }

    const deviceUpdate = new DeviceUpdate({deviceId: req.body.deviceId, modifiedBy: req.user._id, status: req.body.status, read: false });
    await deviceUpdate.save();

    await Device.updateOne({deviceId:req.body.deviceId},{status:req.body.status});

    return res.status(200).send("OK");
};

//check device is valid, has checked in and has not yet been claimed by any tenant
export const getUnclaimedDevice = async (req, res)=>{
    const unclaimedDevice = await UnclaimedDevice.findOne({deviceId:req.params.id, claimed:false});
    if (unclaimedDevice) {
        return res.status(200).send("device found");
    }
    else{
        return res.status(404).send("device not found");
    }
};

//udate device name and location
export const editDevice = async (req, res)=>{
    console.log(req.body);
    const device = await Device.findOne({deviceId: req.body.deviceId, tenant:req.user.tenant});
    if(device){
        await Device.updateOne({_id: device._id},{title:req.body._title, location:req.body._location, room:req.body._room})
    }
    return res.status(200).send("edit device");
};

//TODO delete device
export const deleteDevice = async (req, res)=>{
    console.log(req.body);
    const device = await Device.deleteOne({deviceId: req.params.id, tenant:req.user.tenant});
    if (device.deletedCount > 0) {
        await UnclaimedDevice.updateOne({deviceId: req.params.id},{claimed:false});
        await DeviceUpdate.deleteMany({deviceId: req.params.id});
        return res.status(200).send("delete device");
    }
    else{
        return res.status(404).send('device not found');
    }
};  


///END web client calls////////////////


//IOT client calls ///////////////

//get updates for IOT device - on / off status
export const getUpdates = async (req, res)=>{

    console.log(JSON.stringify(req.headers));
    if (req.header('temp')) {
        await Device.updateOne({deviceId:req.user.deviceId},{lastSeen:Date.now(), temp: req.header('temp')});
    }
    else{
        await Device.updateOne({deviceId:req.user.deviceId},{lastSeen:Date.now()});
    }
    const updates = await DeviceUpdate.find({deviceId:req.user.deviceId, read: false});
    let ids = updates.map(u=> u._id);
    await DeviceUpdate.updateMany({_id: {$in:ids}}, {$set:{"read": true}});
    return res.status(200).send(updates);
    
}

//initial connection, check in and get auth token when registered
export const registerDevice = async (req, res)=>{
    const unclaimedDevice = await UnclaimedDevice.findOne({deviceId:req.params.id});
    if (unclaimedDevice) {
        if (unclaimedDevice.claimed) {
            console.log('device claimed');
            let token = jwt.sign({deviceId: req.params.id, tenant: unclaimedDevice.tenant},process.env.JWT_SECRET,{
                expiresIn: '7y'
            });
            res.setHeader('Authorization', 'Bearer '+ token);
            return res.status(200).send('Device registered');
        }
        else{
            console.log('device not claimed');
            await UnclaimedDevice.updateOne({deviceId:req.params.id}, {lastSeen: Date.now()});
            return res.status(200).send({status:"checkedIn"});
        }
    }
    else{
        console.log('device first connection');
        let newUnclaimedDevice = new UnclaimedDevice({
            deviceId: req.params.id,
            claimed:false
        });
        await newUnclaimedDevice.save();
        return res.status(200).send({status:"registered"});
    }
}
//END IOT client calls ///////////////



