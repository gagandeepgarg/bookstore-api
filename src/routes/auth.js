import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { sendResetPasswordEmail, sendResetPasswordConfirmationEmail } from '../mailer';

const router = express.Router();

router.post('/', (req, res) => {
    const { credentials } = req.body;
    User.findOne({ username: credentials.username }).then(user => {
        if (user && user.isValidPassword(credentials.password)) {
            res.json({ user: user.toAuthJson() });
        } else {
            res.status(400).json({ errors: { global: "Invalid Credentials" } });
        }
    })
});

router.post('/confirmation', (req, res) => {
    const { token } = req.body;
    User.findOneAndUpdate({ confirmationToken: token }, { confirmationToken: '', confirmed: true },
        { new: true })
        .then(user =>
            user ? res.json({ user: user.toAuthJson() })
                : res.status(400).json({})
        );
});

router.post('/resetPasswordRequest', (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if(user) { 
                sendResetPasswordEmail(user);
                res.json({});
            } else {
                res.status(400).json({ errors: { global: "No account exists with entered email id" } });
            }
        });
});

router.post('/validateResetPasswordToken', (req, res) => {
    jwt.verify(req.body.token, process.env.JWT_SECRET,(err)=>{
        if(err){
            res.status(401).json({});
        } else{
            res.json({});
        }
    });
});
router.post('/resetPassword', (req, res) => {
    const {password,token} = req.body.data;
    jwt.verify(token, process.env.JWT_SECRET,(err,decoded)=>{
        if(err){
            res.status(401).json({errors:{global:"Invalid token"}});
        } else{
            User.findOne({_id:decoded._id}).then(user=>{
                if(user){
                    user.setPassword(password);
                    user.save().then(()=> {
                        sendResetPasswordConfirmationEmail(user);
                        res.json({})
                    });
                }
                else{
                    res.status(404).json({errors:{global:"Invalid token"}});
                }
            })
        }
    });
});

export default router;