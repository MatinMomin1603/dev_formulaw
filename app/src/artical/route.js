const express = require("express");
const router = express.Router();
const blog = require('../../models/articals');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const { isValidToken} = require('../../../middlewares/auth');
const { fileUploadBase64, deleteKey } = require("../../../services/s3bucket");

router.post('/', async(req, res) => {
    try {
        const { title, content, displayOn, link, extention, img } = req.body;
        const data = new blog({
            title: title,
            content: content,
            displayOn: displayOn,
            link: link,
        });
        let get = await data.save();
        if (get._id) {
            let img_path = "Artical/images/" + get._id + '.' + extention.split('/')[1];
            await fileUploadBase64(img_path, img, extention);
            let updateData = await blog.findOneAndUpdate({ _id: get._id }, { $set: { imageUrl: img_path } }, { new: true });
            res.status(200).json({ message: "Artical Added Sucessfully..!", status: true, statusCode: 200, data: updateData })
        } else 
            res.status(400).json({ message: "Something Went Wrong..", status: false, statusCode: 400 });
    } catch (error) {
        console.log('error :', error);
        res.status(500).json({ message: "Something Went Wrong..", status: false, statusCode: 500})
    }
});

router.get('/',isValidToken, async(req, res) => {
    try {
        let data = await blog.aggregate([{
            "$project": {
                title: 1,
                imageUrl: { $concat: ["https://formulaw.s3.ap-south-1.amazonaws.com/", "$imageUrl"] },
                createdOn: 1,
                link: 1,
                content: 1,
                updatedOn: 1,
                displayOn: 1
            }
        }]);

        if (data) 
            res.status(200).json({ message: "Data Found....!", status: true, statusCode: 200, data: data });
         else 
            res.status(400).json({ message: "Something Went Wrong..", status: false, statusCode: 400 });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something Went Wrong..", status: true, statusCode: 500 })
    }
})



router.put('/', async(req, res) => {
    try {
        const { _id } = mongoose.Types.ObjectId(req.body._id);
        if (req.body.img) 
        {
            await deleteKey(req.body.imageUrl);
            await fileUploadBase64(req.body.imageUrl, req.body.img, req.body.extention);
        }
        const get = await blog.findOneAndUpdate({ _id }, {
            $set: {
                title: req.body.title,
                content: req.body.content,
                displayOn: req.body.displayOn,
                imageUrl: req.body.imageUrl,
                link: req.body.link,
                updatedOn: new Date(),
                displayOn: new Date()
            }
        });
        if (get._id)
            res.status(200).json({ message: "Artical Updated Sucessfully..", status: true, statusCode: 200 });
        else
            res.status(400).json({ message: "Something Went Wrong..", status: false, statusCode: 400 });
    } catch (error) {
    console.log('error :', error);
        res.status(500).json({ message: "Something Went Wrong..", status: false, statusCode: 500})
    }
});


router.delete('/:id', async(req, res) => {
    try {
        const _id = mongoose.Types.ObjectId(req.params.id);
        const get = await blog.findOne({_id});
        if(get){
            await deleteKey(get.imageUrl)
            let data = await blog.deleteOne({ _id });
            res.status(200).json({ message: "Artical Deleted Sucessfully..", status: true, statusCode: 200 })
        }


       

    } catch (error) {

        console.log("error", error)
        res.status(400).json({ message: "something went weong", status: false, statusCode: 400 })

    }

})


module.exports = router;