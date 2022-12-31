require('dotenv').config();
const express = require('express');
const router = express.Router();
const adminSchema = require('../../models/admin');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const {isValidToken} = require('../../../middlewares/auth');
const passwordhelper = require('../../../helpers/password');


router.post('/signup',async(req,res)=>{
    try {
    const { username, password, email, type} = req.body;

    let adminData = {
        username: username,
        password: await passwordhelper.hash(password),
        email: email,
        type: type,
        createdOn: new Date(),
        updatedOn: null,
        is_login: false,
        login_last: null
    }
        let insertedData =  await new adminSchema(adminData).save();
        if(insertedData){
            res.status(200).json({status: true, statusCode: 200,message:  type + "Created Successfully..",data: insertedData});
        }
        else
            res.status(400).json({status: false, statusCode: 400,message: "Something Went Wrong Please Try Again"});
        } catch (error) {
        console.log('error :', error);
            res.status(500).json({status:false, statusCode:500, message: "Something Went Wrong.."})
    }

});

router.post('/login', async(req,res)=>{
    try {
        const { username, password} = req.body;
        if(username && password){
            let getData = await adminSchema.findOne({username});
            if(getData){
                let result = await passwordhelper.compare(password,getData.password);
                if(result) {
                    await adminSchema.updateOne({_id: getData._id},{$set: {is_login: true,login_last: new Date()}},{new: true})
                    let tocken = jwt.sign({_id: getData._id}, process.env.JWT_SECRET,{expiresIn: process.env.JWT_EXPIRES_IN});
                    res.status(200).json({status: true, statusCode: 200,message: "Login Successfully..",data: getData, access_tocken: tocken});
                }
                else 
                res.status(400).json({status: false, statusCode: 400,message: "Invalid Credentials, Please Try Again"});
            } else
                res.status(400).json({status: false, statusCode: 400,message: "Invalid Credentials, Please Try Again"});
            
        }
    } catch (error) {
    console.log('error :', error);
        res.status(500).json({status:false, statusCode:500, message: "Something Went Wrong.."})
        
    }
  
})




module.exports = router;