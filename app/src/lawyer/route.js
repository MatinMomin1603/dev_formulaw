require('dotenv').config();
const express = require('express');
const router = express.Router();
const LawyerModel = require('../../models/lawyer');
const specializationModel = require('../../models/specialities');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const otpHelper = require('../../../helpers/otp');
const {isValidToken} = require('../../../middlewares/auth')
const { fileUploadBase64, deleteKey } = require('../../../services/s3bucket');





router.post('/login', async(req,res)=>{
    try {
        let otp = await otpHelper.otpGenerator();
        let check = await LawyerModel.findOne({phoneNo: req.body.phoneNo});
        if(check) {
          await LawyerModel.updateOne({phoneNo: req.body.phoneNo},{otp: otp,otp_generated_at: new Date()})
         res.status(200).json({status: true,statusCode: 200,message: "OTP sent successfully",otp: otp});
        } 
        else{
         const lawyerData = {
             firstName: '',
             lastName: '',
             name:'',
             email: '',
             state:'',
             city:'',
             langauge:'',
             phoneNo: req.body.phoneNo,
             otp: otp,
             otp_generated_at: new Date(),
             createdOn: new Date(),
             updatedOn: null,
             login_last: null,
             is_login: false,
             experience: '',
         }
           let get = await new LawyerModel(lawyerData).save( function(err,success){
         if(err){
         console.log('err :', err);
             res.status(400).json({
                 staus:false,
                 statuscode: 400,
                 message: "Something went wrong",
             })
         }
         else{
             res.status(200).json({
                 status: true,
                 statusCode: 200,
                 message: "OTP sent successfully",
                 otp: otp
             })
         }
           });
           
        }
    } catch (error) {
    console.log('error :', error);
         res.status(500).json({
            status: false,
            statusCode: 500,
            message: "Something Went Wrong"
         })
    }
});


router.post('/verifyOtp', async(req, res) => {
    try {
        let check = await LawyerModel.findOne({ phoneNo: req.body.phoneNo });
        if (check) {
            let min = await otpHelper.otpExpiry(check.otp_generated_at);
            let signup;
            if (check.email == '' || check.email == null || check.email == undefined) signup = false;
            else signup = true
            if (min > 5) res.status(202).json({ status: false, statusCode: 202, message: "OTP expired" });
            else if (!(check.otp == req.body.otp)) {
                return res.status(400).json({ message: "Invalid otp", status: false, statusCode: 400 })
            } else {
                await LawyerModel.updateOne({ phoneNo: req.body.phoneNo }, { is_login: true, login_last: new Date(), updatedOn: new Date() });
                let token = jwt.sign({ _id: check._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
                res.status(200).json({ message: "Lawyer verified successfully", status: true, statusCode: 200, data: check, access_token: token, signup: signup });
            }
        } else
            res.status(200).json({ message: "Invalid otp", status: false, statusCode: 200 });
    } catch (error) {
        console.log('error :', error);
        res.status(500).json({ status: false, statusCode: 500, message: "Something Went Wrong" });
    }
});


router.post('/signup', async(req, res) => {
    try {
        const { name, email, phoneNo, state, city, resume, langauge, firmName, extension, specialization, _id, experience } = req.body;
        let check = await LawyerModel.findOne({ phoneNo: phoneNo });
        const checkEmail = await LawyerModel.findOne({ email });
        if(specialization.length > 0){
            specialization.forEach(element => {
                element._id = mongoose.Types.ObjectId(element._id);
            });
        }
        if (checkEmail != null) {
            return res.status(400).json({ message: "This Email is already use Try Again...!", status: false, signup: false, statusCode: 400 });
        } else if (check) {
            let resume_path = "lawyer/resume/" + check._id + '.' + extension.split('/')[1];
            await fileUploadBase64(resume_path, resume, extension);
            const updateLawyer = await LawyerModel.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(_id) }, { name: name, email: email, firmName: firmName, specialization: specialization, state: state, city: city, resume: resume_path, langauge: langauge, experience: experience, updatedOn: new Date(), login_last: new Date(), is_login: true }, { new: true })
            res.status(200).json({ status: true, statusCode: 200, message: "Lawyer Registered Successfully", data: updateLawyer, signup: true });
        } else {
            res.status(400).json({ message: "Something Went Wrong..", status: 400, statusCode: 400 })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: false, statusCode: 500, message: "Something Went Wrong.." });
    }
});


router.delete('/',async(req,res)=>{
    try {
        const getPath = await LawyerModel.findOne({_id: mongoose.Types.ObjectId(req.body._id)});
        if(getPath._id){
           let result =  await deleteKey(getPath.resume);
           console.log('result :', result);
           const get = await LawyerModel.deleteOne({_id: mongoose.Types.ObjectId(req.body._id)});
           if(get)
            res.status(200).json({status:true, statusCode:200, message: "Lawyer Deleted Successfully.."});
           else
              res.status(400).json({status:false, statusCode:400, message: "Something Went Wrong.."});
        }
    } catch (error) {
    res.status(500).json({status:false, statusCode:500, message: "Something Went Wrong.."})
    }  
});


router.get('/getLawyers', async(req, res) => {
    try {
        const { limit, page } = req.query;
        let _id = req.query.id;
        if (_id) {
            let client = await LawyerModel.find({ _id: mongoose.Types.ObjectId(_id)})
            if (client)
                res.status(200).json({ message: "Lawyer found...!", status: true, statusCode: 200, data: client })
            else
                res.status(400).json({ message: "Something Went Wrong...", status: 400, statusCode: 400 })
        } else {
            let count = await LawyerModel.count();
            let client = await LawyerModel.find({}).limit(limit).skip((page - 1) * limit)
            if (client) {
                res.status(200).json({ message: "Data Found...!", status: 200, statusCode: 200, data: client, totalcount: count })
            } else {
                res.status(400).json({ message: "Something Went Wrong...", status: 400, statusCode: 400 })
            }
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong...!", status: false, statusCode: 500 })

    }
});

router.get('/list',isValidToken, async(req, res) => {
    try {
        const { status, is_Online } = req.query;
        let match = {}
        if(is_Online)
          match.is_Online = (is_Online.toLowerCase() === 'true');
        if(status)
          match.isApproved = status;

        let client = await LawyerModel.aggregate([{
            '$match': match
        }, {
            '$project': {
                'firstName': 1,
                'lastName': 1,
                'email': 1,
                'phoneNo': 1,
                'state': 1,
                'city': 1,
                'langauge': 1,
                'createdOn': 1,
                'updatedOn': 1,
                'login_last': 1,
                'is_login': 1,
                'isApproved': 1,
                'specialization': 1
            }
        }])
        if (client) {
            res.status(200).json({ message: "Data found", status: true, statusCode: 200, data: client })
        } else {
            res.status(400).json({ message: "Something Went Wrong", status: false, statusCode: 400 })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something Went Wrong", status: false, statusCode: 500 })
    }
});

router.put('/updateStatus',  async(req, res) => {
    try {
      const{  _id, isApproved }= req.body
        if(isApproved == 'pending' || isApproved == 'approved' || isApproved == 'rejected' ){
            let client = await LawyerModel.updateOne({ _id }, { isApproved: req.body.isApproved });
            if (client) {
                res.status(200).json({ message: "Lawyer Status Updated..!", status: true, statusCode: 200 })
            } else {
                res.status(400).json({ message: "Something Went Wrong..!", status: false, statusCode: 400 })
            }
        }
        else res.status(400).json({ message: "Invalid Status, Please try again..", status: false, statusCode: 400 })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something Went Wrong..!", status: false, statusCode: 500 })
    }
});


router.post('/update_online', isValidToken, async(req, res) => {
    try {
        const { is_Online, _id } = req.body

        let client = await LawyerModel.updateOne({ _id }, {$set: { is_Online: is_Online }});
        if (client) {
            res.status(200).json({ message: "Lawyer Online status Updated...!", status: true, statuscode: 200 });
        } else {
            res.status(400).json({ message: "Something Went Wrong", status: false, statusCode: 400 })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something Went Wrong", status: false, statusCode: 500 })
    }
});

router.put('/editLawyer', isValidToken, async(req, res) => {
    try {
        let profile_path,resume_path;
        const { name, email, firmName, state, city, resume, specialization, lawyerimage, extension, extension_resume, _id, langauge } = req.body
        if (lawyerimage && extension) {
            profile_path = "lawyer/profile/" + _id + '.' + extension.split('/')[1];
            await fileUploadBase64(profile_path, lawyerimage, extension);
        }
        if (resume && extension_resume) {
            resume_path = "lawyer/resume/" + _id + '.' + extension_resume.split('/')[1];
            await deleteKey('https://formulaw.s3.ap-south-1.amazonaws.com/' + resume_path);
            await fileUploadBase64(resume_path, resume, extension_resume);
        }
        let client = await LawyerModel.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(_id) }, { name: name, email: email, firmName: firmName, state: state, city: city, specialization: specialization, lawyerimage: profile_path, langauge: langauge, resume: resume_path, updatedOn: new Date() }, { new: true })
        if (client) {
            res.status(200).json({ message: "Lawyer Updated Sucessfully..!", status: true, statusCode: 200, data: client })
        } else {
            res.status(400).json({ message: "Something Went Wrong", status: false, statusCode: 400 })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something Went Wrong", status: false, statusCode: 500 })
    }
});

router.post('/addlawyer', isValidToken, async(req, res) => {
    try {
        let resume_path;
        let finalSpecialization = [];
        const { name, email, phoneNo, state, city, resume, langauge, firmName, extension, specialization, } = req.body;
        let specialities = await specializationModel.find();
       specialization.forEach((element)=>{
        finalSpecialization =  specialities.filter((element1)=>{return element1._id == element})
         });
        const lawyerdata = await LawyerModel({ name: name, email: email, phoneNo: phoneNo, state: state, city: city, resume: resume_path, langauge: langauge, firmName: firmName, specialization: finalSpecialization }).save()
        if (lawyerdata) {
            if(resume){
                let resume_path = "lawyer/resume/" + lawyerdata._id + '.' + extension.split('/')[1];
                await fileUploadBase64(resume_path, resume, extension);
                let update = await LawyerModel.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(lawyerdata._id) }, { $set: { resume: resume_path } }, { new: true })
            }
           
            res.status(200).json({ message: "lawyer Add Sucessfully...!", status: true, statusCode: 200, data: resume? update : lawyerdata})
        } else {
            res.status(400).json({ message: "Something Went Wrong..!", status: false, statusCode: 400 })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ meessage: "Something Went Wrong...!", status: false, statusCode: 500 })
    }
});

// [
//     {
//       '$match': {
//         'type': 'divorce'
//       }
//     }, {
//       '$unwind': {
//         'path': '$answers', 
//         'preserveNullAndEmptyArrays': true
//       }
//     }, {
//       '$lookup': {
//         'from': 'questions', 
//         'localField': 'answers.questionId', 
//         'foreignField': '_id', 
//         'as': 'que'
//       }
//     }, {
//       '$unwind': {
//         'path': '$que'
//       }
//     }, {
//       '$project': {
//         'type': 1, 
//         'userId': 1, 
//         'answers': 1, 
//         'que': 1, 
//         'q': {
//           '$filter': {
//             'input': '$que.options', 
//             'as': 'item', 
//             'cond': {
//               '$eq': [
//                 '$$item._id', '$answers.optionId'
//               ]
//             }
//           }
//         }
//       }
//     }
//   ]
  

module.exports = router;