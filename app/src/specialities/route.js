require('dotenv').config();
const express = require('express');
const router = express.Router();
const specialitieSchema = require('../../models/specialities');
const mongoose = require('mongoose');
const {isValidToken} = require('../../../middlewares/auth')


router.post('/',async(req,res)=>{
    const { name } = req.body;
    const data = await new specialitieSchema({name:name,createdOn: new Date()}).save();
    if(data){
        res.status(200).json({status:true, statusCode: 200, message:"Speciality Inserted Sucessfully.."});
    }else{
        res.status(400).json({status:true, statusCode: 400, message:"Something Went Wrong, Please Try Again.."});
    }
});


router.get('/', async(req, res) => {
    try {
        let client = await specialitieSchema.find()

        if (client) {
            res.status(200).json({ message: "Speciality list found....!", statusCode: 200, status: true, data: client })
        } else {
            res.status(400).json({ message: "something went wrong..!", statusCode: 400, statusCode: false })
        }
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: "something went wrong..!", statusCodde: 500, status: false })

    }
});


router.put('/update/:id', async(req, res) => {
    try {
        const _id = req.params.id
        let client = await specialitieSchema.findByIdAndUpdate(_id, { name: req.body.name, createdOn: new Date(), updatedOn: new Date() }, { new: true });
        if (client) {
            res.status(200).json({ message: "speciality updated...!", status: true, statusCode: 200 })
        } else {
            res.status(400).json({ message: "something went wrong..!", status: false, statusCodd: 400 })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong..!", status: false, statusCode: 500 })
    }
});

router.delete('/delete/:id', async(req, res) => {
    try {
        const _id = req.params.id
        let check = await specialitieSchema.findByIdAndDelete(_id)
        if (check) {
            res.status(200).json({ message: "speciality deleted..!", status: true, statusCode: 200 })
        } else {
            res.status(400).json({ message: "something went wrong..!", staus: false, statusCodd: 400 })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "spmething went wrong...!", status: false, statusCode: 500 })

    }
})

module.exports = router;
