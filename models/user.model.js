import mongoose from 'mongoose';
import bycrypt from 'bcrypt';
const {Schema} = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: 'Name is required'
    },
    email: {
        type: String,
        trim: true,
        required: 'Email is required',
        unique: true
    },
    password: {
        type: String,
        trim: true,
        required: true,
        min: 6,
        max: 64
    },
    tenant:{
        type: String,
        trim: true,
        required: 'Tenant is required'
    },
    admin:{
        type: Boolean,
        default:false
    }
}, 
    {timestamps: true }
);

userSchema.pre('save', function(next){
    let user = this;

    if(user.isModified('password')){
        return bycrypt.hash(user.password, 12, function(err, hash){
            if(err){
                console.log('BCRYPT HASH ERR', err);
                return next(err);
            }
            user.password = hash;
            return next();
        });
    } else{
        return next();
    }
});

userSchema.methods.comparePassword = function (password, next){
    bycrypt.compare(password, this.password, function(err, match){
        if(err){
            console.log('COMPARE PASSWORD ERROR', err);
            return next(err, false);
        }else{
            console.log('MATCH PASSWORD', match);
            return next(null, match); //true
        }
    })
}

export default mongoose.model('User', userSchema);