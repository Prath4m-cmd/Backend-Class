const bcrypt=require('bcrypt');
const User=require("../models/User");



exports.signup=async (req,res)=>{
    try{
        //get data
        const {name,email,password,role}=req.body;
        //check if user alredy exist
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exist"
            })
        }
        
        // secure password
        let hashedPassword;
        try{
            hashedPassword=await bcrypt.hash(password,10);
        }
        catch(err){
            res.status(500).json({
                success:false,
                message:"Error in hashing password"
            })
        }

        //create entry for user
        const user=await User.create({
            name,email,password:hashedPassword,role
        })

        res.status(200).json({
            success:true,
            message:"User Created Successfully"
        }); 
    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            success:false,
            message:"User cannot be register please try later",
            error:err.message
        });
    }
}
