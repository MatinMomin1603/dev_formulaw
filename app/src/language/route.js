require('dotenv').config();
const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    try {

        let data = [{
                lang: "English",

            },
            {
                lang: "Hindi",

            },
            {
                lang: "Malayalam"
            },
            {
                lang: "Tamil",

            },
            {
                lang: "Telugu",

            },
        ];

        res.status(200).json({ status: true, statusCode: 200, langauge: data })

    } catch (error) {

        res.status(500).json({ message: "something went wrong", status: false, statusCode: 500 })

    }
})



module.exports = router;