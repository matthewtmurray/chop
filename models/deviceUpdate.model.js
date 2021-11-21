import mongoose from 'mongoose';

const {Schema} = mongoose;

const deviceUpdateSchema = new Schema({
    deviceId: {
        type: String,
        trim: true
    },
    modifiedBy:{
        type: String,
        trim: true
    },
    status:{
        type: Boolean
    },
    read:{
        type: Boolean
    }
}, 
    {timestamps: true }
);


export default mongoose.model('DeviceUpdate', deviceUpdateSchema);