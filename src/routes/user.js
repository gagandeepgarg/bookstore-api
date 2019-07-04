import express from 'express';
import User from '../models/User';
import parseErrors from '../utils/parseErrors'
import { sendConfirmationEmail } from '../mailer.';

const router = express.Router();

router.post('/', (req, res) => {
    const { username, password, email } = req.body.user;
    const user = new User({ username, email })
    user.setPassword(password);
    user.setConfirmationToken();
    user.save()
        .then(userRes => {
            sendConfirmationEmail(user);
            res.json({ user: userRes.toAuthJson() });
        })
        .catch(err => {
            res.status(400).json({ errors: parseErrors(err.errors) })
        });
});
router.post('/resendConfirmationLink', (req, res) => {
    const {username} = req.body;
    User.findOne({username}, (err, user) => {
        user.setConfirmationToken();
        user.save((saveerr) => {
            if(saveerr) {
                res.status(400).json({ errors: "user not found" })
            }
            sendConfirmationEmail(user);
            res.json({});
        });
    });
});
export default router;