require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const customerSupportTypeModel = require('../../models/customerSupportType')
const {isValidToken} = require('../../../middlewares/auth');

router.get('/', async(req,res)=>{
    try {

        let getTypes = await customerSupportTypeModel.find();
        console.log('getTypes :', getTypes);

        if(getTypes.length){
            res.status(200).json({ message: "Data Found", status: true, statusCode: 200, data: getTypes })
        } else {
            res.status(400).json({ message: "Something Went Wrong", status: true, statusCode: 400 })
        }
        
    } catch (error)  {
        console.log(error);
        res.status(500).json({ message: "Something Went Wrong", status: false, statusCode: 500 })
    }
})


module.exports = router;