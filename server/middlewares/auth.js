const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

//auth
exports.auth = async (req, res, next) => {
    try{

        //extract token
        const token = req.cookies.token 
        || req.body.token 
        || req.header("Authorization").replace("Bearer ", "");
        
        // console.log("In Auth middleware extracting token...", token)
        //if token missing, then return response
        if(!token) {
            return res.status(401).json({
                success:false,
                message:'TOken is missing',
            });
        }
        // console.log("Verifying token")
        //verify the token
        try{
            const decodedPayload =  jwt.verify(token, process.env.JWT_SECRET);
            console.log("decodedPayload",decodedPayload);
            // console.log("req:",req)
            req.user = decodedPayload;//adding payload in req for further use
            console.log("req.user:",req?.user)
        }
        catch(error) {
            //verification - issue
            return res.status(401).json({
                success:false,
                message:'token is invalid',
            });
        }
        next();
    }
    catch(error) {  
        return res.status(401).json({
            success:false,
            message:'Something went wrong while validating the token in auth middleware',
        });
    }
}

//isStudent
exports.isStudent = async (req, res, next) => {
 try{
        // console.log(" at isStudent middleware,req.user :",req.user)
        // console.log("User role:", req.user.accountType)

        if(req.user.accountType !== "Student") {
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Students only',
            });
        }
        // console.log("Student Role is verified")
        next();
 }
 catch(error) {
    return res.status(500).json({
        success:false,
        message:'User role cannot be verified, please try again'
    })
 }
}


//isInstructor
exports.isInstructor = async (req, res, next) => {
    try{
           if(req.user.accountType !== "Instructor") {
               return res.status(401).json({
                   success:false,
                   message:'This is a protected route for Instructor only',
               });
           }
           next();
    }
    catch(error) {
       return res.status(500).json({
           success:false,
           message:'User role cannot be verified, please try again'
       })
    }
   }


//isAdmin
exports.isAdmin = async (req, res, next) => {
    try{    
           console.log("Printing AccountType ", req.user.accountType);
           if(req.user.accountType !== "Admin") {
               return res.status(401).json({
                   success:false,
                   message:'This is a protected route for Admin only',
               });
           }
           next();
    }
    catch(error) {
       return res.status(500).json({
           success:false,
           message:'User role cannot be verified, please try again'
       })
    }
   }