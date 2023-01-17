const express = require('express');
const mongoose = require('mongoose');
const { fileUploadBase64 } = require('../../../services/s3bucket');
const db = require('../../../config/db');
const router = express.Router();
const banner = require('../../models/banner');
const { isValidToken} = require('../../../middlewares/auth');



//Add Banner
router.post('/',isValidToken, async(req, res) => {
    try {
        const { content, link, extention, icon, type, status } = req.body;
        const data = new banner({
            content: content,
            link: link,
            type: type,
            status: status
        });
        let get = await data.save();
        if (get._id) {
            let icon_path = "Artical/images/" + get._id + '.' + extention.split('/')[1];
            await fileUploadBase64(icon_path, icon, extention);
            let updateData = await banner.findOneAndUpdate({ _id: get._id }, { $set: { imageUrl: icon_path } }, { new: true });
            res.status(200).json({ status: true, statusCode: 200, message: "Banner Add Successfully", data: updateData });
        } else {
            res.status(400).json({ status: false, statusCode: 400, message: "Something Went Wrong.." });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong", status: false, statusCode: 500 })
    }
});


//get Banner fir admin pagination
router.get('/',isValidToken, isValidToken, async(req, res) => {
    try {
        let count = await banner.find().count();
        let get1 = await banner.find();
        let get = await banner.aggregate([
        //     {
        //     '$match': {
        //         '$or': [{
        //             'type': req.query.type
        //         }, {
        //             'type': 3
        //         }]
        //     }
        // }, 
        {
            '$skip': (req.query.page - 1) * 10
        }, {
            '$limit': req.query.limit * 1
        }, {
            '$project': {
                'content': 1,
                'link': 1,
                'imageUrl': {
                    '$concat': [
                        'https://formulaw.s3.ap-south-1.amazonaws.com/', '$imageUrl'
                    ]
                },
                'createdOn': 1,
                'updatedOn': 1,
                'type': 1,
                'status': 1
            }
        }]);
        if (get)
            res.status(200).json({ message: "Data Found...!", status: true, statusCode: 200, data: get, totalCount: count });
        else
            res.status(400).json({ message: "Data Not Found", statusCode: 400, status: false });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: " Somethig went wrong data not found...! ", status: false, statusCode: 500 })
    }
});


//get Banner
router.get('/getBanner',isValidToken, async(req, res) => {
    try {

        let client = await banner.aggregate([{
            '$match': {
                $and: [
                    {'status': true},{
                        '$or': [{
                            'type': req.query.type
                        }, {
                            'type': 3
                        }]
                    }
                ]
            }
        }, {
            '$project': {
                'content': 1,
                'link': 1,
                'imageUrl': {
                    '$concat': [
                        'https://formulaw.s3.ap-south-1.amazonaws.com/', '$imageUrl'
                    ]
                },
                'createdOn': 1,
                'updatedOn': 1,
                'type': 1,
                'status': 1
            }
        }])
        if (client) {
            res.status(200).json({ message: "Banner Found Sucessfully...!", status: true, statusCode: 200, data: client })
        } else {
            res.status(400).json({ message: "Something Went Wrong...!", status: false, statusCode: 400 })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something Went Wrong...!", status: false, statusCode: 500 })

    }
})


router.put('/update',isValidToken, async(req, res) => {
    try {
        const _id = mongoose.Types.ObjectId(req.body._id);
        if (req.body.icon) 
            await fileUploadBase64(req.body.imageUrl, req.body.icon, req.body.extention);

        let get = await banner.findOneAndUpdate({ _id }, {
            $set: {
                content: req.body.content,
                link: req.body.link,
                imageUrl: req.body.imageUrl,
                updatedOn: new Date()
            }
        });

        if (get) 
           res.status(200).json({ message: "Banner Updated sucessfully...!", status: true, statusCode: 200, });
        else 
           res.status(400).json({ message: "Something Went Wrong...", status: false, statusCode: 400 });


    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "error Not updated...!", status: false, statusCode: 400 })
    }
});

//update Banner status for Admin

router.put('/updateStatus',isValidToken, async(req, res) => {
    try {
        const { _id, status } = req.body
        let client = await banner.updateOne({ _id }, { $set: { status: status } });
        if (client) {
            res.status(200).json({ message: "Banner Status Updated...!", status: true, statusCode: 200 })
        } else {
            res.status(400).json({ message: "Something Went Wrong...!", status: false, statusCode: 400 })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something Went Wrong", status: false, statusCode: false })

    }
})


router.delete('/delete/:id', async(req, res) => {
    try {
        const _id = mongoose.Types.ObjectId(req.params.id)
        await banner.deleteOne({ _id })
          res.status(200).json({ message: "Banner Deleted sucessfully...!", status: true, statusCode: 200 })
    } catch (error) {
        res.status(400).json({ message: "Something Went Wrong...", status: false, statusCode: 400, error })
    }
})

module.exports = router;