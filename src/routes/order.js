import express from 'express';
import User from '../models/User';
import Order from '../models/Order';
import authenticate from '../middlewares/authenticate';

const router = express.Router();
router.use(authenticate);

router.get('/loadUserOrdersData', (req, res) => {
    const pageNumber = req.query.pageNumber;
    const filesPerPage = req.query.filesPerPage;
    const username = req.query.username;
    User.findOne({username}, (err, user) => {
        if(err){
            res.status(400).json({ errors: "Invalid User" })
        } else{
            Order.find({userId:user._id},(err, orders) => {
                if(err){
                    res.status(400).json({ errors: "Unable to fetch orders" })
                } else{
                    if(orders && orders.length>0){
                        const startIndex= (pageNumber-1)*filesPerPage;
                        const endIndex= startIndex+ filesPerPage+1;
                        orders= orders.slice(startIndex, endIndex);
                        res.json(orders);
                    } else{
                        res.json([]);
                    }
                }
            })
        }
    });
});





export default router;