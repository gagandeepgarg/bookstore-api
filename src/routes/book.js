import express from 'express';
import Book from '../models/Book';
import User from '../models/User';
import UserBook from '../models/UserBook';
import authenticate from '../middlewares/authenticate';

const router = express.Router();
router.use(authenticate);

//router.get('/getBooksData',authenticate, (req, res) => {
router.get('/getBooksData', (req, res) => {
    const pageNumber = req.query.pageNumber;
    const filesPerPage = req.query.filesPerPage;
    Book.find({}, (err, books) => {
        if(err){
            res.status(400).json({ errors: "unable to fetch books" })
        } else{
            const startIndex= (pageNumber-1)*filesPerPage;
            const endIndex= startIndex+ filesPerPage+1;
            books= books.slice(startIndex, endIndex);
            res.json(books)
        }
    });
});
router.get('/getUserBooksData', (req, res) => {
    const pageNumber = req.query.pageNumber;
    const filesPerPage = req.query.filesPerPage;
    const username = req.query.username;
    let userBooks =[];
    Book.find({},(err,books)=> userBooks=books);
    User.findOne({username}, (err, user) => {
        if(err){
            res.status(400).json({ errors: "Invalid User" })
        } else{
            UserBook.find({userId:user._id},(err, books) => {
                if(err){
                    res.status(400).json({ errors: "Invalid User" })
                } else{
                    userBooks= userBooks.filter(b=> books.find(book=>book.bookId==b._id));
                    const startIndex= (pageNumber-1)*filesPerPage;
                    const endIndex= startIndex+ filesPerPage+1;
                    userBooks= userBooks.slice(startIndex, endIndex);
                    res.json(userBooks)
                }
            })
        }

    })
});

export default router;