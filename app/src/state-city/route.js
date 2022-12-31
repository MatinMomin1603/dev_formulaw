require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const statecitySchema = require('../../models/statecity');
const router = express.Router();

router.get('/', async(req, res) => {
    try {
        let state = req.query.state;
        if (state) {
            let data = await statecitySchema.aggregate([{
                '$match': {
                    'state': state
                }
            }, {
                '$project': {
                    'cities': {
                        "$map": {
                            input: "$city",
                            as: "city",
                            in: { "city": "$$city" }
                        }
                    }
                }
            }]);
            if (data)
                res.status(200).json({ message: "Data found", status: true, statusCode: 200, data: data[0].cities })
            else {
                res.status(400).json({ message: "Something went wrong", status: false, statusCode: 400, data: data })

            }

        } else {
            let data = await statecitySchema.aggregate([{
                '$project': {
                    'state': 1
                }
            }]);
            if (data)
                res.status(200).json({ message: "Data found", status: true, statusCode: 200, data: data })
            else {
                res.status(400).json({ message: "Something went wrong", status: false, statusCode: 400, data: data })
            }
        }


    } catch (error) {
        console.log('error :', error);
        res.status(500).json({ message: "Something went wrong", status: false, statusCode: 500, data: data })
    }

})

module.exports = router;