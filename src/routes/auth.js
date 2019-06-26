import express from 'express';
import User from '../models/User';

const router = express.router();

router.post('/', (req, res) => {
    const { credentials } = req.body;
    User.findOne({ username: credentials.username }).then(user => {
        if (user && user.isValidPassword(credentials.password)) {
            res.json({user : user.toAuthJson()});
        } else {
            res.status(400).json({ errors: { global: "Invalid Credentials" } });
        }
    })
});

export default router;