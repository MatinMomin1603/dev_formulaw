const express = require('express')
const mongoose = require('mongoose')
const router = express.Router();
const user = require('../../models/user')
const { isValidToken } = require('../../../middlewares/auth')
const { fileUploadBase64, deleteKey } = require('../../../services/s3bucket');


router.put('/', isValidToken, async(req, res) => {
    try {
        const _id = mongoose.Types.ObjectId(req.body._id);

        let client = await user.updateOne({ _id }, {
            "$set": {
                altPhone: req.body.altPhone,
                langauge: req.body.langauge
            }
        })
        if (client) {
            res.status(200).json({ message: "User Updated Sucessfully", status: true, statusCode: 200 })
        } else {
            res.status(400).json({ message: "something went wrong", status: false, statuscode: 400 })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "somethig went wrong", status: false, statuscode: 500 })

    }


})

router.get('/getusers', async(req, res) => {
    try {
        let _id = req.query.id;
        const { page, limit } = req.query

        if (_id) {
            let check = await user.find({ _id: mongoose.Types.ObjectId(_id) })
            if (check)
                res.status(200).json({ message: "User found...!", status: true, statusCode: 200, data: check })
            else
                res.status(400).json({ message: "something went wrong...!", status: false, statusCode: 400 })
        } else {
            let count = await user.count();
            let check = await user.find({}).limit(limit).skip((page - 1) * limit)
            if (check) {
                res.status(200).json({ message: "Data Found...!", status: true, statusCode: 200, data: check, totalCount: count })
            } else {
                res.status(400).json({ message: "something went wrong..!", status: true, statusCode: 400 })
            }
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wron..!", status: false, statusCode: 500 })

    }
});

router.put('/editUser', isValidToken, async(req, res) => {
    try {
        let profile_path;
        const { firstName, lastName, email, gender, profileImage, _id, extension, pincodeNo } = req.body

        if (profileImage && extension) {
            profile_path = "user/profile/" + _id + '.' + extension.split('/')[1];
            await fileUploadBase64(profile_path, profileImage, extension);
        }

        let client = await user.findByIdAndUpdate({ _id }, { firstName: firstName, lastName: lastName, email: email, gender: gender, profileImage: profile_path, pincodeNo: pincodeNo, updatedOn: new Date() }, { new: true })
        if (client) {
            client.profileImage = 'https://formulaw.s3.ap-south-1.amazonaws.com/' + client.profileImage;
            res.status(200).json({ message: "User Updated Sucessfully...!", status: true, statusCode: 200, data: client })
        } else {
            res.status(400).json({ message: "Something Went Wrong..!", status: false, statusCode: 400 })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something Went Wrong...!", status: false, statusCode: 500 })
    }

})


router.get('/getUserProfile',  async(req, res) => {
    try {
        let check = await user.aggregate([{
            '$match': {
                '_id': mongoose.Types.ObjectId(req.query._id)
            }
        }, {
            '$project': {
                'profileImage': {
                     $ifNull: [{ $concat: ["https://formulaw.s3.ap-south-1.amazonaws.com/", "$profileImage"] }, ""] 
                }
            }
        }])
        if (check) {
            res.status(200).json({ message: "Image Found...!", status: true, statusCode: 200, data: check })
        } else {
            res.status(400).json({ message: "Something Went Wrong..!", status: false, statusCode: 400 })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went Wrong...!", status: false, statusCode: 500 })
    }
});


router.get('/getUserDetails', isValidToken ,async(req,res)=>{
      const _id = mongoose.Types.ObjectId(req.query.id)
     const getUserDetails = await user.aggregate([{
        '$match': {
            _id
        }
     },
     {

        '$project': {
            'firstName':1,
            'lastName':1,
            'email':1,
            'phoneNo':1,
            'createdOn':1,
            'updatedOn':1,
            'pincodeNo':1,
            'gender':1,
            'is_login':1,
            'profileImage':  {
                $cond: { if: { $eq: [ "$profileImage", '' ] }, then: null, else: { $concat: ["https://formulaw.s3.ap-south-1.amazonaws.com/", "$profileImage"]} }
              }
        }
    }
    ])

    if(getUserDetails)
        return res.status(200).json({status: true, statusCode: 200, data: getUserDetails, message: "User find successfully"})
    else 
        return res.status(400).json({ message: "Something Went Wrong..!", status: false, statusCode: 400 })

})







module.exports = router;