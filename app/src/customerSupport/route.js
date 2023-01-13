const express = require('express')
const mongoose = require('mongoose');
const router = express.Router();
const customerSupport = require('../../models/customerSupport');


router.post('/', async(req, res) => {
    try {
        const { question, answer, type } = req.body;
        const data = await customerSupport({
            question: question,
            answer: answer,
            type: type
        });
        let client = await data.save();
        if (data) {
            res.status(200).json({ message: "Added Sucessfully", status: true, statusCode: 200, data: client })
        } else {
            res.status(400).json({ message: "Something Went Wrong", status: false, statusCode: 400 })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something Went Wrong", status: false, statusCode: 500 })

    }
});

router.get('/', async(req, res) => {
    try {
        const {typeId} = req.query
        console.log('typeId :', typeId);
        let customerSupportData = await customerSupport.aggregate([
            {
              '$match': {
                'typeId':  mongoose.Types.ObjectId(typeId)
              }
            }, {
              '$lookup': {
                'from': 'customersupporttypes', 
                'localField': 'typeId', 
                'foreignField': '_id', 
                'as': 'typeData'
              }
            }, {
              '$unwind': {
                'path': '$typeData'
              }
            }, {
              '$project': {
                'question': 1, 
                'answer': 1, 
                'typeId': 1, 
                'createdOn': 1, 
                'typeData': 1
              }
            }
          ]);

          console.log('customerSupportData :', customerSupportData);
        if (customerSupportData) {
            res.status(200).json({ message: "Data Found", status: true, statusCode: 200, data: customerSupportData })
        } else {
            res.status(400).json({ message: "Something Went Wrong", status: true, statusCode: 400 })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something Went Wrong", status: false, statusCode: 500 })
    }
});

router.put('/',async(req,res)=>{
    try {
       let data =  await customerSupport.updateMany({type: "LawyerNotResponding"},{$set: {typeId: mongoose.Types.ObjectId("63c1069a3d4b983eee0f32ac")}})
       console.log('data :', data);
    } catch (error) {
        
    }
})


module.exports = router;