import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import Token from '../models/token.model';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import {sendEmail} from '../services/email.service';

export const register =  async (req, res)=>{
    console.log(req.body);
    const {name, email, password, tenant} = req.body;
    //validation
    if(!name) return res.status(400).send('Name is required');
    if(!tenant) return res.status(400).send('Tenant is required');
    if(!password || password.length < 6) return res.status(400).send('Pasword is required and should be min 6 characters long');

    let userExist = await User.findOne({email}).exec();
    let tenantExist = await User.findOne({tenant}).exec();
    if(userExist) return res.status(400).send('Email is taken');
    
    if(tenantExist) return res.status(400).send('Tenant is taken');
    req.body.admin = true;
    
    //register

    const user = new User(req.body);

    try{
        await user.save();
        console.log('USER CREATED', user);
        return res.json({ok:true});
    }catch(err){
        console.log('CREATE USER FAILED', err)
        return res.status(400).send('Error, try again.');
    }
};

export const login = async(req,res)=>{
    //console.log(req.body);

    const {email, password} = req.body;
    
    try{
        let user = await User.findOne({email}).exec();
        console.log('USER EXISTS', user);
        if (!user) {
            return res.status(400).send('User with that email address not found');
        }
        //compare password
        user.comparePassword(password,(err,match)=>{
            console.log('COMPARE PASSWORD IN LOGIN ERR',err);
            if (!match || err) {
                return res.status(400).send("Wrong password");
            }
            //'GENERATE TOKEN AND SEND AS REPONSE TO CLIENT'
            let token = jwt.sign({_id: user._id, tenant: user.tenant},process.env.JWT_SECRET,{
                expiresIn: '7d'
            });
            console.log(JSON.stringify(user));
            return res.json({
                token,
                 user:{
                     _id: user._id,
                     name: user.name,
                     email: user.email,
                     tenant: user.tenant,
                     createdAt: user.createdAt,
                     updatedAt: user.updatedAt,
                     admin: user.admin
                    }});
        })
    }catch(err){
        console.log('LOGIN ERROR', err);
        res.status(400).send('Logon failed');
    }
};

export const forgotPassword = async (req,res)=>{
    
    const user = await User.findOne({email:req.body.email});
    if (user == null) {
        return res.status(404).send('email not found');
    }
    
    const token = await Token.findOne({email:req.body.email});
    if (token) {
        token.deleteOne();
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = await bcrypt.hash(resetToken,12);
    const _token = new Token({
        userId:user._id,
        token: tokenHash
    });

    _token.save();

    sendEmail(req.body.email, resetToken,user._id);

    return res.status(200).send(`A password reset email has been sent to ${req.body.email}`);
}

export const resetPassword = async (req,res)=>{

    const {resetToken,userId,password} = req.body;
    
    const token = await Token.findOne({userId: userId});
    let validPassword = false;
    
    if (token != null) {
        bcrypt.compare(resetToken, token.token, function(err, match){
            if(err){
                return res.status(404).send("reset token invalid");
            }else{
                //update password for user
                bcrypt.hash(password,12).then( async (hashedPassword)=> {
                    await User.updateOne({_id: userId}, {password: hashedPassword});
                });
                
                //delete entry in tokens table
                token.deleteOne();
                return res.status(200).send('Password reset successful');
            }
        });

    }
    else{
        return res.status(404).send("reset token invalid");
    }
} 