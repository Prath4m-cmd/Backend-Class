//auth, isStudent,isAdmin

const jwt=require("jsonwebtoken");
require("dotenv").config();

exports.auth= (req,res,next)=>{
    try{
        //extract jwt token
        //pending: other ways to fetch tokens
        // console.log("cookies", req.cookies.token);
        // console.log("body", req.body.token)
        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ","");

        if(!token){
            res.status(401).json({
                success:false,
                message:"Token Missing"
            })
        }

        //verify the token 
        try{
            const payload=jwt.verify(token,process.env.JWT_SECRET);
            // console.log(payload);

            req.user=payload;
        } catch(err){
            return res.status(401).json({
                success:false,
                message:'token is invalid'
            });
        }

        next();

    } catch(error){
        return res.status(401).json({
            success:false,
            message:"Something went wrong, while verifying the token"
        })
    }
}

exports.isStudent= (req,res,next)=>{
    try{
        if(req.user.role !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Student"
            });
        }
        next();
    } catch(err){
        return res.status(500).json({
            success:false,
            message:"User role is not matching"
        })
    }
}

exports.isAdmin= (req,res,next)=>{
    try{
        if(req.user.role !=="Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Admin"
            });
        }
        next();
    } catch(err){
        return res.status(500).json({
            success:false,
            message:"User role is not matching"
        })
    }
}