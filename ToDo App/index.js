const express=require('express');
const app=express();

//load config from env files
require("dotenv").config();
const PORT=process.env.PORT || 4000;

//middle ware to parse json request body
app.use(express.json());

// Import routes for TODO api
const todoRoutes = require('./routes/todos');

// mount the todo API routes
app.use('/api/v1', todoRoutes);

// connect to database
const dbConnect = require('./config/database');
dbConnect();

// start the server
app.listen(PORT, () => {
    console.log(`Server Started Successfully at ${PORT}`);
});

//default route 
app.get('/',(req,res)=>{
    res.send(`<h1> This is Homepage</h1>`);
})