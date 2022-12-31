require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const questionSchema = require('../../models/questions');
var ObjectID = require('mongodb').Objectid;
const {isValidToken} = require('../../../middlewares/auth');



router.post('/addQuestion', async(req,res)=>{
    try {
        const question = {
            type: 'other-issue',
            question: 'Hello Rahul, can you tell me your other issue is?',
            createdOn: new Date(),
            updatedOn: new Date(),
            options:[
                {
                    _id: new mongoose.Types.ObjectId(),
                    option: ' Rental Dispute',
                    createdOn: new Date(),
                    updatedOn: new Date(),
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    option: 'Property dispute',
                    createdOn: new Date(),
                    updatedOn: new Date(),
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    option: 'Consumer grievances',
                    createdOn: new Date(),
                    updatedOn: new Date(),
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    option: 'Power of attorney',
                    createdOn: new Date(),
                    updatedOn: new Date(),
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    option: 'Drafting of agreements',
                    createdOn: new Date(),
                    updatedOn: new Date(),
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    option: 'Maintenance',
                    createdOn: new Date(),
                    updatedOn: new Date(),
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    option: 'Cheque bounce cases',
                    createdOn: new Date(),
                    updatedOn: new Date(),
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    option: 'Bail',
                    createdOn: new Date(),
                    updatedOn: new Date(),
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    option: 'Property registration',
                    createdOn: new Date(),
                    updatedOn: new Date(),
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    option: 'Affidavits',
                    createdOn: new Date(),
                    updatedOn: new Date(),
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    option: 'Rental Agreements',
                    createdOn: new Date(),
                    updatedOn: new Date(),
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    option: ' Civil pleadings',
                    createdOn: new Date(),
                    updatedOn: new Date(),
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    option: 'Registration of various Deeds',
                    createdOn: new Date(),
                    updatedOn: new Date(),
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    option: 'Gift Deed',
                    createdOn: new Date(),
                    updatedOn: new Date(),
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    option: 'Partnership agreements',
                    createdOn: new Date(),
                    updatedOn: new Date(),
                },
                {
                    _id: new mongoose.Types.ObjectId(),
                    option: 'Custody of child',
                    createdOn: new Date(),
                    updatedOn: new Date(),
                }

            ]}

          let data = new questionSchema(question)
           let get = await data.save()
           console.log('get :', get);
           if(get){
            res.status(200).json({status:true,statusCode: 200,message: "Suceess"});
           }
           else{
    res.status(400).json({status:false,statusCode: 400,message: "Failed"});

           }
    } catch (error) {
    console.log(' error:', error);
    res.status(400).json({status:false,statusCode: 400,message: "Failed"});
        
    }
 

})

router.patch('/updateQuestion/:id',async (req,res)=>{
    try {
        const _id = mongoose.Types.ObjectId(req.params.id);
         let get = await questionSchema.findOneAndUpdate({_id},
            {$set: {nextQuestionId: mongoose.Types.ObjectId('6368f667670226bd91aaca4f')}});
         if(get){
            res.status(200).json({status:true,statusCode: 200,message: "Suceess"});
           }
           else{
            res.status(400).json({status:false,statusCode: 400,message: "Failed"});
           }
    } catch (error) {
        
    }
})


router.get('/getQuestion',isValidToken,async(req,res)=>{
    try {
        const {type, next_id} = req.query;
        if(next_id){
            // let data = await questionSchema.findOne({_id: mongoose.Types.ObjectId(next_id),type: type});
            let data = await questionSchema.aggregate([
                {
                  '$match': {
                    'type': type,
                    "_id": mongoose.Types.ObjectId(next_id)
                  }
                },{
                    '$project':{
                            "type": 1,
                            "question": 1,
                            "createdOn": 1,
                            "updatedOn": 1,
                            "options": {
                                $map:
                                   {
                                     input: "$options",
                                     as: "option",
                                     in: { 
                                        "_id": "$$option._id",
                                        "option": "$$option.option",
                                        "createdOn": "$$option.createdOn",
                                        "updatedOn": "$$option.updatedOn",
                                        "check": false
                                     }
                                   }
                              },
                            "nextQuestionId": 1
                    }
                }
              ]);
            if(data.length > 0)
               res.status(200).json({status: true, statusCode: 200,message: 'Question Found Successfully..',data: data[0]});
            else 
               res.status(400).json({status: false, statusCode: 400,message: 'Something Went Wrong'});
        }
        else{

           let data = await questionSchema.aggregate([
                {
                  '$match': {
                    'type': type, 
                  }
                },{
                    '$project':{
                            "type": 1,
                            "question": 1,
                            "createdOn": 1,
                            "updatedOn": 1,
                            "options": {
                                $map:
                                   {
                                     input: "$options",
                                     as: "option",
                                     in: { 
                                        "_id": "$$option._id",
                                        "option": "$$option.option",
                                        "createdOn": "$$option.createdOn",
                                        "updatedOn": "$$option.updatedOn",
                                        "check": false
                                     }
                                   }
                              },
                            "nextQuestionId": 1
                    }
                }
              ]);
         
            if(data.length > 0)
               res.status(200).json({status: true, statusCode: 200,message: 'Question Found Successfully..',data: data[0]});
            else 
               res.status(400).json({status: false, statusCode: 400,message: 'Something Went Wrong'});
        }
    } catch (error) {
    console.log('error :', error);
    res.status(500).json({status: false, statusCode: 500,message: 'Something Went Wrong'});
    }
})
module.exports = router;