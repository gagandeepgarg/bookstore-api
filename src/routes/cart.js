import express from 'express';
import Book from '../models/Book';
import User from '../models/User';
import Cart from '../models/Cart';

const router = express.Router();

router.get('/getUserCartItems', (req, res) => {
    const username = req.query.username;
    User.findOne({username}, (err, user) => {
        if(err){
            res.status(400).json({ errors: "Invalid User" })
        } else{
            Cart.find({userId:user._id},(err, cartItems) => {
                if(err){
                    res.status(400).json({ errors: "unable to fetch cart items" })
                } else{
                    console.log(cartItems)
                    res.json(cartItems)
                }
            });
        }
    });
});
router.get('/addToCart', (req, res) => {
    const book = req.body.book;
    const {userId} = req.body.user._id;
    // Book.findOne({username}, (err, user) => {
    //     if(err){
    //         res.status(400).json({ errors: "Invalid User" })
    //     } else{
    //         Cart.find({userId:user._id},(err, cartItems) => {
    //             if(err){
    //                 res.status(400).json({ errors: "unable to fetch cart items" })
    //             } else{
    //                 console.log(cartItems)
    //                 res.json(cartItems)
    //             }
    //         });
    //     }
    // });
});

export default router;