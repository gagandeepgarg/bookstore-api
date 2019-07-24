import mongoose from 'mongoose';
import Cart from './Cart';

const orderSchema= new mongoose.Schema({
    userId:{type:String, required:true},
    TotalOrderPrice:{type:Number,required:true},
    Status:{type:String,required:true},
    orderItems:{type:[],required:true}
},
{timestamps:true});

export default mongoose.model('Order', orderSchema);