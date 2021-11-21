import User from '../models/user.model';

//create user
export const addUser = async (req,res)=>{
    
    console.log(req.body);
    const {name, email, password} = req.body;

    if(!name) return res.status(400).send('Name is required');
    
    if(!password || password.length < 6) return res.status(400).send('Pasword is required and should be min 6 characters long');


    let userExist = await User.findOne({email}).exec();
    req.body.admin = false;
    req.body.tenant = req.user.tenant;
   
    if(userExist) return res.status(400).send('Email is taken');
    
    const user = new User(req.body);

    try{
        await user.save();
        console.log('USER CREATED', user);
        return res.json({ok:true});
    }catch(err){
        console.log('CREATE USER FAILED', err)
        return res.status(400).send('Error, try again.');
    }
}

//get all users
export const getUsers = async (req,res)=>{
    const users = await User.find({tenant:req.user.tenant},{password:0});
    return res.status(200).send(users);
}

//TODO get single user
export const getUser = async (req,res)=>{

};

//TODO update user

export const updateUser = async (req,res)=>{
    console.log('update user');

    const _user = await User.find({_id: req.body._id, tenant: req.user.tenant});
    if (_user != null) {
        await User.updateOne({_id:req.body._id},{name: req.body._name, email:req.body._email});
        return res.status(200).send('user updated');
    }
    else{
        return res.status(404).send('user not found');
    }
};

//TODO delete user

export const deleteUser = async (req,res)=>{
    const result = await User.deleteOne({tenant: req.user.tenant, _id: req.params.id, admin: false});
    if (result.deletedCount > 0) {
        return res.status(200).send(`user ${req.params.id} deleted`);
    }
    else{
        return res.status(400).send("user not deleted");
    }
};