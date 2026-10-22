//app create
const express = require("express");
const app = express();


//port findout
require("dotenv").config();
const PORT = process.env.PORT || 3000;

//middleware 
app.use(express.json());
const fileuplaod = require("express-fileupload");
app.use(fileuplaod({
    useTempFiles: true,
    tempFileDir: "D:/temp/"
}));

//DB connect
const db = require("./config/database");
db.connect();

// cloud connect
const cloudinary = require("./config/cloudinary");
cloudinary.cloudinaryConnect();

//api mount
const Upload = require("./routes/FileUpload")
app.use("/api/v1/upload", Upload);


//activate server
app.listen(PORT, () => {
    console.log(`App is Running at port ${PORT}`)
})