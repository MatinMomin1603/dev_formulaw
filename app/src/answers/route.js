require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const answerSchema = require('../../models/answers');
const questionSchema = require('../../models/questions')
const jwt = require('jsonwebtoken');
const {isValidToken} = require('../../../middlewares/auth');


router.post('/insert',isValidToken, async(req,res,next)=>{
    try {
        const { _id , userId, type, questionId, optionId, manulAnswer} = req.body;
        let getQuestAns = await questionSchema.aggregate([
            {
              '$match': {
                '_id': mongoose.Types.ObjectId(questionId)
              }
            }, {
              '$project': {
                'question': 1, 
                'optionData': {
                  '$arrayElemAt': [
                    {
                      '$filter': {
                        'input': '$options', 
                        'as': 'item', 
                        'cond': {
                          '$eq': [
                            '$$item._id', mongoose.Types.ObjectId(optionId)
                          ]
                        }
                      }
                    }, 0
                  ]
                }
              }
            }
          ]);

        if(!userId)
           return  res.status(400).json({status:false,statusCode:400,message:"Something Went Wrong.."});
        if(_id){
            const answers = {
                questionId: mongoose.Types.ObjectId(questionId),
                optionId: mongoose.Types.ObjectId(optionId),
                question: getQuestAns[0].question,
                option: getQuestAns[0].optionData.option,
                manulAnswer: manulAnswer,
                createdOn: new Date() 
            }
            const get = await  answerSchema.findByIdAndUpdate({_id: mongoose.Types.ObjectId(_id)},{ $push: { answers: answers }},{new:true});
            if(get._id)
            return  res.status(200).json({status:true, statusCode: 200,message: 'Answer Submittted Successfully',data:get})
            else
            return  res.status(400).json({status:false, statusCode: 400,message: 'Something Went Wrong..'})
        
        }
        else{
          const data = {
            userId: mongoose.Types.ObjectId(userId),
            type: type,
            answers : {
                questionId: mongoose.Types.ObjectId(questionId),
                optionId: mongoose.Types.ObjectId(optionId),
                question: getQuestAns[0].question,
                option: getQuestAns[0].optionData.option,
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

router.get('/getProBonoRequest',isValidToken,async(req,res)=>{
    try {
        const {page,limit,search} = req.query;
        let totalCount = await answerSchema.find({'type': 'pro-bono'}).count();
       let probonoRequest = await answerSchema.aggregate([
     {
            '$sort': {
                '_id': -1
            }
        }, {
            '$lookup': {
                'from': 'users', 
                'localField': 'userId', 
                'foreignField': '_id', 
                'pipeline': [
                    {
                        '$project': {
                            'firstName': 1, 
                            'lastName': 1, 
                            'email': 1, 
                            'phoneNo': 1, 
                            'pincodeNo': 1, 
                            'gender': 1
                        }
                    }
                ], 
                'as': 'userData'
            }
        }, {
            '$unwind': {
                'path': '$userData'
            }
        }, {
            '$project': {
                'type': 1, 
                'answers': 1, 
                'userData': 1,
                'createdOn': 1
            }
        },    {
            '$match':  
            {
                '$and': [
                {'type': 'pro-bono'},
                {
                 '$or': [
                     { 'userData.firstName': { $regex: search+'', '$options': 'i' } },
                     { 'userData.lastName': { $regex: search+'', '$options': 'i' } },
                     {'userData.email':{ $regex: search+'', '$options': 'i'}}
                 ]
                }
             ]
            }
        },{
            $skip: (page- 1) * 10
        },{
            $limit: limit * 1
        }
    ])
    
    console.log('probonoRequest :', probonoRequest);
    if(probonoRequest.length)
                res.status(200).json({status:true, statusCode: 200,message: 'Data Found Successfully',data:probonoRequest, totalCount: totalCount})
            else
                res.status(400).json({status:false, statusCode: 400,message: 'Something Went Wrong..'})
        
    } catch (error) {
        console.log('error :', error);
        res.status(500).json({status:false, statusCode: 500,message: 'Something Went Wrong..'})
    }
})

module.exports = router;