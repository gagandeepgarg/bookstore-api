import mongoose from'mongoose';

const UserBookSchema = new mongoose.Schema({
    userId:{type:String, required:true},
    bookId:{type:String, required:true}
},
{timestamps:true})

export default mongoose.model('Userbook',UserBookSchema);