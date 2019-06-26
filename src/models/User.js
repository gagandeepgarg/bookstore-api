import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// add uniqueness and email validations
const userSchema = new mongoose.Schema({
    username:{type:String, required:true,lowercase:true, index:true},
    passwordHash:{type:String, required:true}
},
{timestamps:true});

userSchema.methods.isValidPassword = function isValidPassword(password){
    return bcrypt.compareSync(password, this.passwordHash);
};
userSchema.methods.generateJWT = function generateJWT(){
    return jwt.sign({
        username:this.username
    },"secretkey")
};

userSchema.methods.toAuthJson = function toAuthJson(){
    return {
        username: this.username,
        token: this.generateJWT()
    }
};

export default mongoose.model('User', userSchema);