import express from 'express';
import path from 'path';
const app = express();

app.get("/*",(req,res)=>{
    res.sendFile(path.join(__dirname,"index.html"));
});

app.post("/api/auth",(req,res)=>{
    res.status(400).json({errors:{global:"Invalid Credentials"}});
});

app.listen(8080, ()=>console.log("running at localhost:8080"));