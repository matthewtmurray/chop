import mongoose from 'mongoose';

const {Schema} = mongoose;

const tokenSchema = new Schema({
    userId: {
        type: String
    },
    token: {
        type: String
    }
}, 
    {timestamps: true }
);


export default mongoose.model('Token', tokenSchema);