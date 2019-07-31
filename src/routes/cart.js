import express from 'express';
import User from '../models/User';
import Cart from '../models/Cart';
import Order from '../models/Order';
import Userbook from '../models/UserBook';
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
                    res.json(cartItems)
                }
            });
        }
    });
});
router.post('/addToCart', (req, res) => {
    const book = req.body.book;
    const username = req.body.username;
    User.findOne({username}, (err, user) => {
        if(err){
            res.status(400).json({ errors: "Invalid User" });
        } else{
            Cart.findOneAndUpdate({userId:user._id,bookId:book._id}, {$inc : {'quantity' : 1}},
                { new: true }, (err,cartItem) => {
                if(cartItem){
                    Cart.find({userId:user._id},(err, cartItems) => {
                        res.json({ success:true,cartItems });
                    }); 
                }
                else{
                    const item= new Cart({
                        userId:user._id,
                        bookId:book._id,
                        bookName:book.bookName,
                        quantity:1,
                        pricePerUnit:book.price
                    });
                    item.save().then(i => {
                        Cart.find({userId:user._id},(err, cartItems) => {
                           return res.json({ success:true,cartItems });
                        }); 
                    })
                    .catch(err => res.status(400).json({ errors:err.errors }));
                }
            });
        }
    });
});

router.post('/removeFromCart', (req, res) => {
    const cartItem = req.body.cartItem;
    Cart.findOneAndRemove({_id:cartItem._id}, (err, item) => {
        if(!err){
            Cart.find({userId:item.userId},(err, cartItems) => {
                res.json({ success:true,cartItems });
            }); 
        } else{
            res.status(400).json({ errors:err.errors });   
        }
    })
});

router.post('/updateQuantity', (req, res) => {
    const cartItem = req.body.cartItem;
    Cart.findOneAndUpdate({_id:cartItem._id}, { quantity: cartItem.quantity },
        { new: true }).then(cartItem => {
        if(cartItem){
            Cart.find({userId:cartItem.userId},(err, cartItems) => {
                res.json({ success:true,cartItems });
            }); 
        }
        else{  res.status(400).json({ errors: err.errors });   
        }
    });
});

router.post('/checkout', (req, res) => {
    const username = req.body.username;
    User.findOne({username}, (err, user) => {
        if(err){
            res.status(400).json({ errors: "Invalid User" })
        } else{
            Cart.find({userId:user._id}).then(cartItems => {
                if(cartItems){
                    let total=0;
                    cartItems.forEach(cI=>{
                        total+=(cI.quantity*cI.pricePerUnit);
                        const userbook=new Userbook({
                            userId:cI.userId,
                            bookId:cI.bookId
                        })
                        Userbook.findOne({bookId:cI.bookId},(err,book)=>{
                            if(!book)
                            {
                                userbook.save();
                            }
                        });
                    });
                    const order = new Order({
                        userId:user._id,
                        TotalOrderPrice:total,
                        Status:'In Processing',
                        orderItems:cartItems
                    });
                    order.save().then(o => {
                        Cart.remove({userId:user._id}).then(c=>{
                            res.json({ success:true,cartItems:[] });
                        }); 
                    }); 
                }
                else {  res.status(400).json({ errors: err.errors });   
                }
            });
        }
    });
});

export default router;