import express from 'express';
import User from '../models/User';
import parseErrors from '../utils/parseErrors'

const router = express.Router();

router.post('/', (req, res) => {
    const { username, password, email } = req.body.user;
    const user = new User({ username, email })
    user.setPassword(password);
    user.setConfirmationToken();
    user.save()
    .then(userRes => res.json({ user: userRes.toAuthJson() }))
    .catch(err=>{
        res.status(400).json({errors: parseErrors(err.errors)})
    });
});

export default router;