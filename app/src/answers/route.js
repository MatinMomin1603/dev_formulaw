require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const answerSchema = require('../../models/answers');
const jwt = require('jsonwebtoken');
const {isValidToken} = require('../../../middlewares/auth');


router.post('/insert',isValidToken, async(req,res,next)=>{
    try {
        const { _id , userId, type, questionId, optionId, manulAnswer} = req.body;
        if(!userId)
        return  res.status(400).json({status:false,statusCode:400,message:"Something Went Wrong.."});
        if(_id){
            const answers = {
                questionId: mongoose.Types.ObjectId(questionId),
                optionId: mongoose.Types.ObjectId(optionId),
                manulAnswer: manulAnswer,
                createdOn: new Date() 
            }
            const get = await  answerSchema.findOneAndUpdate({_id},{ $push: { answers: answers }});
            if(get._id)
                res.status(200).json({status:true, statusCode: 200,message: 'Answer Submittted Successfully',data:get})
            else
                res.status(400).json({status:false, statusCode: 400,message: 'Something Went Wrong..'})
        
        }
        else{
          const data = {
            userId: mongoose.Types.ObjectId(userId),
            type: type,
            answers : {
                questionId: mongoose.Types.ObjectId(questionId),
                optionId: mongoose.Types.ObjectId(optionId),
                manulAnswer: manulAnswer,
                createdOn: new Date() 
            }
          }
            const get = await new answerSchema(data).save();
            if(get._id)
                res.status(200).json({status:true, statusCode: 200,message: 'Answer Submittted Successfully',data:get})
            else
                res.status(400).json({status:false, statusCode: 400,message: 'Something Went Wrong..'})
        }
    } catch (error) {
    console.log('error :', error);
    res.status(500).json({status:false, statusCode: 500,message: 'Something Went Wrong..'})
        
    }
});

module.exports = router;