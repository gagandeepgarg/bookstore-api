import express from 'express';
import User from '../models/User';

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
    const {token} = req.body;
    User.findOneAndUpdate({ confirmationToken: token }, { confirmationToken: '', confirmed: true },
        { new: true })
        .then(user =>
            user ? res.json({ user: user.toAuthJson() })
                : res.status(400).json({})
        );
});


export default router;