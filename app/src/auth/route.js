require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const userSchema = require('../../models/user');
const jwt = require('jsonwebtoken');
const otpHelper = require('../../../helpers/otp');
const {isValidToken} = require('../../../middlewares/auth')


router.post('/login', async(req,res)=>{
    try {
        let otp = await otpHelper.otpGenerator();
        let check = await userSchema.findOne({phoneNo: req.body.phoneNo});
        if(check) {
          await userSchema.updateOne({phoneNo: req.body.phoneNo},{otp: otp,otp_generated_at: new Date()})
         res.status(200).json({status: true,statusCode: 200,message: "OTP sent successfully",otp: otp});
        } 
        else{
         const userData = {
             firstName: '',
             lastName: '',
             email: '',
             phoneNo: req.body.phoneNo,
             otp: otp,
             otp_generated_at: new Date(),
             createdOn: new Date(),
             updatedOn: null,
             login_last: null,
             is_login: false,
             pincodeNo: '',
             gender: '',
             profileImage:''
         }
           let get = await new userSchema(userData).save( function(err,success){
         if(err){
         console.log('err :', err);
             res.status(400).json({
                 staus:false,
                 statuscode: 400,
                 message: "Something went wrong",
             })
         }
         else{
             res.status(200).json({
                 status: true,
                 statusCode: 200,
                 message: "OTP sent successfully",
                 otp: otp
             })
         }
           });
           
        }
    } catch (error) {
    console.log('error :', error);
         res.status(500).json({
            status: false,
            statusCode: 500,
            message: "Something Went Wrong"
         })
    }
 

});
    

router.post('/verifyOtp', async(req, res) => {
    try {
        let check = await userSchema.findOne({ phoneNo: req.body.phoneNo });
        if (check) {
            let min = await otpHelper.otpExpiry(check.otp_generated_at);
            let signup;
            if (check.email == '' || check.email == null || check.email == undefined) signup = false;
            else signup = true
            if (min > 5) res.status(202).json({ status: false, statusCode: 202, message: "OTP expired" });
            else if (!(check.otp == req.body.otp)) {
                return res.status(400).json({ message: "Invalid otp", status: false, statusCode: 400 })
            } 
            else {
                await userSchema.updateOne({ phoneNo: req.body.phoneNo }, { is_login: true, login_last: new Date(), updatedOn: new Date() });
                let token = jwt.sign({ _id: check._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
                res.status(200).json({ message: "User verified successfully", status: true, statusCode: 200, data: check, access_token: token, signup: signup });
            }
        } else {
            res.status(200).json({ message: "Invalid otp", status: false, statusCode: 200 });
        }
    } catch (error) {
        console.log('error :', error);
        res.status(500).json({
            status: false,
            statusCode: 500,
            message: "Something Went Wrong"
        })
    }
})

router.post('/signUp', async(req,res)=>{
    try {
        let check = await userSchema.findOne({phoneNo: req.body.phoneNo, _id: mongoose.Types.ObjectId(req.body._id)});
        const checkEmail = await userSchema.findOne({email: req.body.email});
        if(checkEmail != null){
            return res.status(400).json({ message: "This Email is already use Try Again...!", status: false, statusCode: 400, signup: false });
        }
        else if(check){
            let get = await userSchema.findByIdAndUpdate({_id: mongoose.Types.ObjectId(req.body._id)},{firstName: req.body.firstName,lastName: req.body.lastName,email: req.body.email, pincodeNo: req.body.pincodeNo, gender: req.body.gender,updatedOn: new Date(),login_last: new Date()},{new:true})
             res.status(200).json({status:true,statusCode:200,message: "User Registered Successfully..",data:get, signup: true})
        }
        else{
            res.status(400).json({status:false,statusCode:400,message: "Something Went Wrong.."})
        }
    } catch (error) {
    console.log('error :', error);
    res.status(500).json({
        status: false,
        statusCode: 500,
        message: "Something Went Wrong"
     })
    }
})

router.get('/userDetails/:_id', isValidToken , async (req,res,next)=>{
    try {
       const  _id =  mongoose.Types.ObjectId(req.params._id);
      const get =  await userSchema.findOne(_id);
      if(get){
        res.status(200).json({
            status: true,
            statusCode: 200,
            message: "User Found successfully",
            data: get
        })
      }
      else{
        res.status(400).json({
            status: true,
            statusCode: 400,
            message: "User Not Found",
            data: get
        })
      }
    } catch (error) {
        return res.status(400).json({
            status: false,
            statusCode: 400,
            msg: "Something Went Wrong",
          });
    }
})


module.exports = router;

