import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

// add uniqueness and email validations
const bookSchema = new mongoose.Schema({
    bookName:{type:String, required:true, unique:true},
    bookTitle:{type:String, required:true,lowercase:true, index:true, unique:true},
    author:{type:String, required:true},
    genrees:{type:String, required:true}
},
{timestamps:true});


bookSchema.plugin(uniqueValidator, {message:'This book name is already taken'});

export default mongoose.model('Book', bookSchema);