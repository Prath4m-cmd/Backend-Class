const express=require('express');
const app=express();

//load config from env files
require("dotenv").config();
const PORT=process.env.PORT || 8000;

//middle ware to parse json request body
app.use(express.json());

// Import routes for TODO api
const postRoutes=require("./routes/postRoutes");
const likeRoutes=require("./routes/likeRoutes");
const commentRoutes=require("./routes/commentRoutes");

// mount the todo API routes
app.use("/api/v1/posts",postRoutes);
app.use("/api/v1/posts",likeRoutes);
app.use("/api/v1/posts",commentRoutes);

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