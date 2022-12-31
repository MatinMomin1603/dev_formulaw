require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const userSchema = require('../app/models/user');
const lawyerSchema = require('../app/models/lawyer');
const adminSchema = require('../app/models/admin');


isValidToken = async(req,res,next) =>{
    if(req.headers.authorization){
        const token = req.headers.authorization.split(" ")[1];
        try {
            const decode = await jwt.verify(token, process.env.JWT_SECRET);
            
            const user = await userSchema.findOne({
                _id: decode._id
            }).catch((error)=>{
            console.log('error :', error);
              return false; 
            });
            const lawyer = await lawyerSchema.findOne({
                _id: decode._id
            }).catch((error)=>{
            console.log('error :', error);
              return false; 
            });
            const admin = await adminSchema.findOne({
                _id: decode._id
            }).catch((error)=>{
            console.log('error :', error);
              return false; 
            });

            if(user){
                req['AuthenticateUser'] = user;
                next();
            }else if(lawyer){
                req['AuthenticateUser'] = lawyer;
                next();
            }else if(admin){
                req['AuthenticateUser'] = admin;
                next();
            } 
            else
               return res.status(401).json({status:false,statusCode: 401, message: "Unauthorized! Please login"});
        } catch (error) {
        console.log('error :', error);
            return res.status(401).json({
                status: false,
                msg: "Unauthorized! Please login",
              });
        }
    }
    else{
        return res.status(401).json({
            status: false,
            msg: "Unauthorized! Please login",
          });
    }
}

module.exports = {
    isValidToken
}