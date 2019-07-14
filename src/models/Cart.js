import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    userId:{type:String, required:true},
    bookId:{type:String, required:true},
    bookName:{type:String, required:true},
    quantity:{type:Number, required:true},
    pricePerUnit:{type:String, required:true}
},
{timestamps:true});

export default mongoose.model('Cart', cartSchema);