import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const bookSchema = new mongoose.Schema({
    bookName:{type:String, required:true, unique:true},
    bookTitle:{type:String, required:true},
    author:{type:String, required:true},
    genrees:{type:String, required:true},
    price:{type:Number,required:true}
},
{timestamps:true});


bookSchema.plugin(uniqueValidator, {message:'This book name is already taken'});

export default mongoose.model('Book', bookSchema);