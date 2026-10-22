const File = require("../models/File");
const cloudinary = require("cloudinary").v2;

//localFileUplaod handler function

exports.localFileUpload = async (req, res) => {
    try {
        //fetch file
        const file = req.files.file;
        console.log("File : ", file);

        let path = __dirname + "/files/" + Date.now() + `.${file.name.split('.')[1]}`;
        console.log("Path-> ", path)
        file.mv(path, (err) => {
            console.log(err)
        });

        res.json({
            success: true,
            message: "Local file uploaded successfully"
        })
    } catch (err) {
        console.log(err)
    }
}

function isFileTypeSupported(type, supportedTypes) {
    return supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file, folder,quality) {
    const options = { folder }
    options.resource_type = "auto";
    if(quality){
        options.quality=quality;
    }
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

//image upload handler
exports.imageUpload = async (req, res) => {
    try {

        const { name, tags, email } = req.body;
        console.log(name, tags, email);

        const file = req.files.imageFile;
        console.log(file);

        //validation
        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split(".")[1].toLowerCase();

        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "File format not supported"
            })
        }

        //file formate supported 
        const response = await uploadFileToCloudinary(file, "Codehelp")
        console.log(response)

        //db me save 
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url
        })

        res.json({
            success: true,
            imageUrl: response.secure_url,
            message: "Image successfully uploaded"
        })


    } catch (err) {
        console.error(err);
        res.status(400).json({
            success: false,
            message: "something went wrong"
        })
    }
}

//video upload handler 
exports.videoUpload = async (req, res) => {
    try {

        const { name, tags, email } = req.body;
        console.log(name, tags, email);

        const file = req.files.videoFile;
        //validation
        const supportedTypes = ["mp4", "mov"];
        const fileType = file.name.split(".")[1].toLowerCase();
        console.log(fileType);


        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "File format not supported"
            })
        }

        //file formate supported 
        const response = await uploadFileToCloudinary(file, "Codehelp")
        console.log(response)

        //db me save 
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url
        })


        res.json({
            success: true,
            imageUrl: response.secure_url,
            message: "video successfully uploaded"
        })

    } catch (err) {
        console.error(err);
        res.status(400).json({
            success: false,
            message: "something went wrong"
        })
    }
}

exports.imageSizeReducer = async (req, res) => {
    try {
        const { name, tags, email } = req.body;
        console.log(name, tags, email);

        const file = req.files.imageFile;
        console.log(file);

        //validation
        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split(".")[1].toLowerCase();

        if (!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success: false,
                message: "File format not supported"
            })
        }

        //file formate supported 
        const response = await uploadFileToCloudinary(file, "Codehelp",30)
        console.log(response)

        //db me save 
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl: response.secure_url
        })

        res.json({
            success: true,
            imageUrl: response.secure_url,
            message: "Image successfully uploaded"
        })

    } catch (err) {
        console.error(err);
        res.status(400).json({
            success: false,
            message: "something went wrong"
        })
    }
}