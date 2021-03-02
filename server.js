const express = require('express');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();


mongoose.connect(process.env.DB_URl,
{ useNewUrlParser: true,useUnifiedTopology: true },
()=>{
    console.log('MongoDB Connected');
})

const app = express();

app.use(express.json());

app.use('/api/user',authRoute);
app.use('/api/posts',postRoute);


app.listen(3000,()=>{
    console.log('Server Up and Running');
})