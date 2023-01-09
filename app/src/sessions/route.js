const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');
const {isValidToken} = require('../../../middlewares/auth')

const sessionModel = require('../../models/session');

// status maintained for seesion
// 1-: pending * status updated by user
// 2-: requested  * status updated by Admin
// 3-: accepted * status updated by Lawyer
// 4-: allocated * status updated by Admin
// 0-: rejected * status updated by Lawyer
router.post('/add',isValidToken, async(req, res) => {
    try {

        const { userId, lawyerName, issue, lawyerId, answersId } = req.body;

        if (!validation(userId)) {
            return res.status(400).json({ status: false, statusCode: 400, message: "Please Provide User Information" });
        }
        // if (!validation(lawyerId)) {
        //     return res.status(400).json({ status: false, statusCode: 400, message: "Please Provide Lawyer Information" });
        // }
        // const session = [{
        //     _id: new mongoose.Types.ObjectId(),
        //     count: 0,
        //     createdOn: new Date()
        // }]
        const data = new sessionModel({
            userId: mongoose.Types.ObjectId(userId),
            // lawyerId: mongoose.Types.ObjectId(lawyerId),
            // lawyerName: lawyerName,
            issue: issue,
            // session: session,
            answersId: answersId,
            new: false
        });
        let get = await data.save()
        if (get) {
            res.status(200).json({ message: "Session added sucessfully....!", status: true, statusCode: 200, })
        } else {
            res.status(400).json({ message: "Something went wrong", status: false, statusCode: 400, })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong", status: false, statusCode: 500 })
    }
});

function validation(key) {
    if (key == undefined || key == null || key == '') {
        return false
    } else return true;
}


router.get('/get',isValidToken, async(req, res) => {
    try {
        let match = {};
        if(req.query.id) match._id = mongoose.Types.ObjectId(req.query.id);
        
        let client = await sessionModel.aggregate(
            [{
                $match: match
            },{
                '$lookup': {
                    'from': 'users',
                    'localField': 'userId',
                    'foreignField': '_id',
                    'pipeline': [{
                        '$project': {
                            'firstName': 1,
                            'lastName': 1,
                            'email': 1,
                            'phoneNo': 1,
                            'pincodeNo': 1,
                            'gender': 1,
                        }
                    }],
                    'as': 'userData'
                }
            }, {
                '$lookup': {
                    'from': 'lawyers',
                    'localField': 'lawyerId',
                    'foreignField': '_id',
                    'pipeline': [{
                        '$project': {
                            'name': 1,
                            'email': 1,
                            'phoneNo': 1,
                            'state': 1,
                            'city': 1
                        }
                    }],
                    'as': 'lawyerData'
                }
            }, {
                '$project': {
                    'issue': 1,
                    'session': 1,
                    'userData': {
                        '$arrayElemAt': [
                            '$userData', 0
                        ]
                    },
                    'lawyerData': {
                        '$arrayElemAt': [
                            '$lawyerData', 0
                        ]
                    },
                    'createdOn': 1,
                    'new': 1,
                    'answersId': 1,
                    'total_session': 1,
                    'status':1,
                    'current_session_paid': 1,
                    'session_completed':1
                }
            }]
        )
        if (client) {
            res.status(200).json({ message: "Data Found Sucessfully...!", status: true, statusCode: 200, data: client })
        } else {
            res.status(400).json({ message: "Something went wrong...!", status: false, statusCode: 400 })
        }

    } catch (error) {
        res.status(500).json({ message: "something went wrong...!", status: false, statusCode: 500 })

    }

});

router.patch('/requestToLawyer',async(req,res)=>{
    try {
        const {_id,lawyerId,lawyerName} = req.body;
        let request = await sessionModel({_id},{$set:{lawyerId,lawyerName,status:2,updatedOn: new Date()}},{new:true});
        if(request){
           return res.status(200).json({status:true,statusCode:200,data: request,message:"Request Sent To Lawyer Successfully."})
        }
        else{
           return res.status(400).json({ message: "Something Went Wrong..", status: false, statusCode: 400 })
        }
    } catch (error) {
    console.log('error :', error);
        res.status(500).json({ message: "Something Went Wrong..", status: false, statusCode: 500 }) 
    }
});

router.patch('/reqAcceptOrReject', async(req, res) => {
    try {
        const { _id, status } = req.body
        let operation = status == 3 ? 'Accepted' : 'Rejected'
        let check = await sessionModel.findByIdAndUpdate({ _id }, { $set: { status, updatedOn: new Date() } }, { new: true })
        if (check) {
            res.status(200).json({ message: `Request ${operation}..`, status: true, statusCode: 200 })
        } else {
            res.status(400).json({ message: "Something Went Wrong", status: true, statusCode: 400, statsu: false,})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something Went Wrong", status: 500, statusCode: 500 })
    }
});


// lawyer allocation

router.patch('/allocateLawyer', async(req, res) => {
    try {
        const { _id, lawyerId, lawyerName } = req.body;
        let request = await sessionModel.findByIdAndUpdate({ _id }, { $set: { lawyerId, lawyerName, status: 4, updatedOn: new Date() } }, { new: true });
        if (request) {
            return res.status(200).json({ status: true, statusCode: 200, data: request, message: "Lawyer Allocated Successfully...!" })
        } else {
            return res.status(400).json({ message: "Something Went Wrong...!", status: false, statusCode: 400 })
        }
    } catch (error) {
        console.log('error :', error);
        res.status(500).json({ message: "Something Went Wrong...!", status: false, statusCode: 500 })
    }
});


router.put('/update', async(req, res) => {
    try {
        const _id = mongoose.Types.ObjectId(req.body._id)
        let client = await sessionModel.findOne({ _id });
        let count = client.total_session;
        if (count > 3) {
            return res.status(500).json({ message: "Maximum limit of Session is 2....!", status: false, statusCode: 500 })
        } else {
            const data = await sessionModel.updateOne({ _id }, {
                "$push": {
                    "session": {
                        _id: mongoose.Types.ObjectId(),
                        count: count,
                        createdOn: new Date()
                    }
                }
            })
            if (data) {
                res.status(200).json({ message: "Updated Sessions", status: true, statCode: 200 });
            } else {
                res.status(400).json({ messsage: "Something Went Wrong...", status: false, statCode: 400 })
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something Went Wrong...", status: false, statCode: 500 })
    }
})

//update count
router.put('/updateCount', async(req, res) => {
    try {

        const _id = mongoose.Types.ObjectId(req.body._id)
        let get = await sessionModel.updateOne({ "session._id": _id }, {
            "$set": {
                "session.$.count": req.body.count
            }
        })
        if (get) {
            res.status(200).json({ message: "updated", status: true, statuscode: 200, })
        } else {
            res.status(400).json({ messsage: "not get", status: false, statusCode: 400 })

        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "not get", status: false, statCode: 500 })

    }
})


router.delete('/:id', async(req, res) => {
    try {
        const _id = mongoose.Types.ObjectId(req.params.id)

        const get = await sessionModel.deleteOne({ _id });
        if (get) {
            res.status(200).json({ message: "Session Deleted Sucessfully...!", status: true, statusCode: 200 });
        } else {
            res.status(400).json({ message: "something went wrong...!", status: false, statusCode: 400, error });
        }
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ message: "Something went wrong", status: false, statusCode: 500 })
    }
})

module.exports = router;