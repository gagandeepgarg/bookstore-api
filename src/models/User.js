import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import uniqueValidator from 'mongoose-unique-validator';

// add uniqueness and email validations
const userSchema = new mongoose.Schema({
    username:{type:String, required:true,lowercase:true, unique:true},
    email:{type:String, required:true,lowercase:true, index:true, unique:true},
    passwordHash:{type:String, required:true},
    confirmed: {type:Boolean, default:false},
    confirmationToken:{type:String, default:''},
},
{timestamps:true});

userSchema.methods.isValidPassword = function isValidPassword(password){
    return bcrypt.compareSync(password, this.passwordHash);
};
userSchema.methods.generateJWT = function generateJWT(){
    return jwt.sign({
        username:this.username,
        email: this.email,
        confirmed: this.confirmed
    },process.env.JWT_SECRET)
};

userSchema.methods.generateResetPasswordToken = function generateResetPasswordToken(){
    return jwt.sign({
        _id: this._id
    },process.env.JWT_SECRET,
    {expiresIn:"1h"})
};

userSchema.methods.toAuthJson = function toAuthJson(){
    return {
        username: this.username,
        confirmed: this.confirmed,
        token: this.generateJWT()
    }
};
userSchema.methods.setPassword = function setPassword(password){
    this.passwordHash = bcrypt.hashSync(password, 10);
}
userSchema.methods.setConfirmationToken = function setConfirmationToken() {
    this.confirmationToken =  this.generateJWT();
}
userSchema.methods.generateConfirmationUrl = function generateConfirmationUrl(){
    return `${process.env.HOST}/confirmation/${this.confirmationToken}`;
}
userSchema.methods.generateResetPasswordUrl = function generateResetPasswordUrl(){
    return `${process.env.HOST}/reset-password/${this.generateResetPasswordToken()}`;
}


userSchema.plugin(uniqueValidator, {message:'This username is already taken'});

export default mongoose.model('User', userSchema);