const mongoose=require('mongoose');
require("dotenv").config();

const dbConnect=()=>{
    mongoose.connect(process.env.DATABASE_URL)
    .then(()=>{
        console.log("Database connection Successfull");
    })
    .catch((err)=>{
        console.log(err);
        process.exit(1);
    })
}

module.exports=dbConnect;