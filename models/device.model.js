import mongoose from 'mongoose';

const {Schema} = mongoose;

const deviceSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: 'Title is required'
    },
    location: {
        type: String,
        trim: true
    },
    room: {
        type: String,
        trim: true
    },
    tenant:{
        type: String,
        trim: true,
        required: 'Tenant is required'
    },
    addedBy: {
        type: String,
        trim: true
    },
    modifiedBy:{
        type: String,
        trim: true
    },
    lastSeen:{
        type:Date
    },
    status:{
        type: Boolean
    },
    deviceId: {
        type: String
    },
    temp:{
        type:String
    }
}, 
    {timestamps: true }
);


export default mongoose.model('Device', deviceSchema);