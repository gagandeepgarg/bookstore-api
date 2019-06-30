import express from 'express';
import User from '../models/User';
import parseErrors from '../utils/parseErrors'

const router = express.Router();

router.post('/', (req, res) => {
    const { username, password } = req.body.user;
    const user = new User({ username })
    user.setPassword(password);
    user.save()
    .then(userRes => res.json({ user: userRes.toAuthJson() }))
    .catch(err=>{ 
        res.json.status(400)({errors: parseErrors(err.errors)})
    });
});

export default router;