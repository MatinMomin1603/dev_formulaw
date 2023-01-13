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
        let client = await customerSupport.aggregate([{
            '$match': {
                'type': req.query.type
            }
        }, {
            '$project': {
                'question': 1,
                'answer': 1,
                'type': 1,
                'createdOn':1
            }
        }]);

        if (client) {
            res.status(200).json({ message: "Data Found", status: true, statusCode: 200, data: client })
        } else {
            res.status(400).json({ message: "Something Went Wrong", status: true, statusCode: 400 })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something Went Wrong", status: false, statusCode: 500 })

    }
});


module.exports = router;