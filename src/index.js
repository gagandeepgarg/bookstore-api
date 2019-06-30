import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

// routers
import auth from './routes/auth';
import users from './routes/user';

dotenv.config();
const app = express();
app.use(bodyParser.json());
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true});

app.get("/*",(req,res)=>{
    res.sendFile(path.join(__dirname,"index.html"));
});

app.use('/api/auth', auth);
app.use('/api/users', users);

app.listen(8080, ()=>console.log("running at localhost:8080"));