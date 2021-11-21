import mongoose from 'mongoose';

const {Schema} = mongoose;

const unclaimedDeviceSchema = new Schema({
    deviceId: {
        type: String,
        trim: true
    },
    tenant:{
        type: String,
        trim: true
    },
    claimed:{
        type: Boolean
    },
    lastSeen: {
        type: Date
    }
}, 
    {timestamps: true }
);


export default mongoose.model('UnclaimedDevice', unclaimedDeviceSchema);