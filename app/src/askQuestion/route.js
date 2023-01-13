const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const {isValidToken} = require('../../../middlewares/auth')
const askQuestion = require('../../models/askquestions');


router.post('/',isValidToken, async(req, res) => {
    try {
        const { userId, question } = req.body

        const data = await askQuestion({
            userId: mongoose.Types.ObjectId(userId),
            question: question,
            createdOn: new Date()
        });

        let ask_question = await data.save();
        if (ask_question) {
            res.status(200).json({ message: "Question Sent Sucessfully", status: 200, statusCode: 200, data: ask_question })
        } else {
            res.status(400).json({ message: "Something Went Wrong", status: 400, statusCode: 400 })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something Went Wrong", status: 500, statusCode: 500 })
    }
});

router.get('/', isValidToken, async(req, res) => {
    try {

        let count = await askQuestion.find().count()
        let data = await askQuestion.aggregate([{
            '$match': {
                'userId': mongoose.Types.ObjectId(req.query.userId)
            }
        }, {
            '$skip': (req.query.page - 1) * 10
        }, {
            '$limit': req.query.limit * 1
        }, {
            '$project': {
                'question': 1,
                'isAnswered': 1,
                'userId': 1,
                'createdOn': 1,
                'answeredOn': 1
            }
        }])
        if (data) {
            res.status(200).json({ message: "Data Found Successfully", status: 200, statusCode: 200, data: data, totalCount: count })
        } else {
            res.status(400).json({ message: "Something Went Wrong", status: 400, statusCode: 400 })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something Went Wrong", status: 500, statusCode: 500 })
    }
});

router.put('/',isValidToken, async(req,res)=>{
    try {
       const { _id, answer } = req.body;
       console.log('answer :', answer);
       let updateData = await askQuestion.findByIdAndUpdate({_id: mongoose.Types.ObjectId(_id)},{$set: {answer:answer,answeredOn: new Date(),isAnswered: true}},{new: true})
       console.log('updateData :', updateData);
    
       if (updateData) {
        res.status(200).json({ message: "Answer Sent Sucessfully", status: 200, statusCode: 200, data: updateData })
    } else {
        res.status(400).json({ message: "Something Went Wrong", status: 400, statusCode: 400 })
    }
    } catch (error) {
        
    }
})

module.exports = router;