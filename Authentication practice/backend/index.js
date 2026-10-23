const express= require('express');
const app=express();

const cors = require("cors");
app.use(cors({ origin: "http://localhost:5173" }));

require("dotenv").config();

const PORT=process.env.PORT || 4000;

app.use(express.json());


require('./config/database').connect();

//route import and mount
const user=require("./routes/user");
app.use("/api/v1", user);

app.listen(PORT,()=>{
    console.log(`App is listing on port ${PORT}`);
})