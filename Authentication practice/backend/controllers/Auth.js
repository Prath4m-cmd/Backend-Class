const bcrypt=require('bcrypt');
const User=require("../models/User");
const jwt=require("jsonwebtoken");
require("dotenv").config();


exports.signup=async (req,res)=>{
    try{
        //get data
        const {name,email,password}=req.body;
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
            name,email,password:hashedPassword
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


exports.signin= async (req,res)=>{
    try{
        const {email,password}=req.body;

        if(!email|| !password){
            return res.status(400).json({
                success:false,
                message:"Please fill all the details carefully"
            })
        }

        let user=await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered"
            })
        }

        const payload ={
            email:user.email,
            id:user._id,
        };
        //verify the password & generate jwt token
        if(await bcrypt.compare(password,user.password)){
            //password match
            let token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"2h"});

            user=user.toObject();
            user.token=token;
            user.password=undefined;

          
            const options = {
                expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly:true,
            }

            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:'User logged in successfully',
            })
        }
        else{
            return res.status(403).json({
                success:false,
                message:"password incorrect"
            })
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Login failure"
        })
    }
}