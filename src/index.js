import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import auth from './routes/auth';

dotenv.config();
const app = express();
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost/bookstore',{useMongoClient:true});

app.get("/*",(req,res)=>{
    res.sendFile(path.join(__dirname,"index.html"));
});

app.use('/api/auth', auth);

app.listen(8080, ()=>console.log("running at localhost:8080"));