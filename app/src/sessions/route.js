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
// 5-: Completed * status updated by Admin
router.post('/add',isValidToken, async(req, res) => {
    try {
        let { userId, issue, answersId, booking_id, total_session,status,current_session_paid ,language} = req.body;
        if (!validation(userId)) {
            return res.status(400).json({ status: false, statusCode: 400, message: "Please Provide User Information" });
        }
        if(!booking_id){
            booking_id = mongoose.Types.ObjectId();
        }
        else{
           booking_id = mongoose.Types.ObjectId(booking_id);
         let  prevSession = await sessionModel.findOne({booking_id});
         answersId = prevSession.answersId;
         issue = prevSession.issue;
         total_session = prevSession.total_session ? prevSession.total_session : 0;
         status =  prevSession.status ? prevSession.status : 1;
         current_session_paid = prevSession.current_session_paid;
         language = prevSession.language;
        }

        const session = {
            _id: mongoose.Types.ObjectId(),
            createdOn: new Date(),
            status: 1
        }
        const data = new sessionModel({
            userId: mongoose.Types.ObjectId(userId),
            issue: issue,
            answersId: mongoose.Types.ObjectId(answersId),
            new: false,
            session: session,
            booking_id: booking_id,
            total_session: total_session,
            status: status,
            language: language,
            current_session_paid:current_session_paid
        });
        let get = await data.save()
        if (get) {
            res.status(200).json({ message: "Session added sucessfully....!", status: true, statusCode: 200});
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


router.get('/get', isValidToken, async(req, res) => {
    try {
        let match = {};
        if (req.query.id) match._id = mongoose.Types.ObjectId(req.query.id);
        let { page, limit } = req.query;
        let totalCount = await sessionModel.find().count();

        let sessions = await sessionModel.aggregate(
            [
               {
                  '$lookup': {
                    'from': 'users', 
                    'localField': 'userId', 
                    'foreignField': '_id', 
                    'pipeline': [
                      {
                        '$project': {
                          'firstName': 1, 
                          'lastName': 1, 
                          'email': 1, 
                          'phoneNo': 1, 
                          'pincodeNo': 1, 
                          'gender': 1
                        }
                      }
                    ], 
                    'as': 'userData'
                  }
                }, {
                  '$lookup': {
                    'from': 'lawyers', 
                    'localField': 'lawyerId', 
                    'foreignField': '_id', 
                    'pipeline': [
                      {
                        '$project': {
                          'name': 1, 
                          'email': 1, 
                          'phoneNo': 1, 
                          'state': 1, 
                          'city': 1
                        }
                      }
                    ], 
                    'as': 'lawyerData'
                  }
                }, {
                  '$lookup': {
                    'from': 'answers', 
                    'localField': 'answersId', 
                    'foreignField': '_id', 
                    'pipeline': [
                      {
                        '$project': {
                          'answers': 1, 
                          'createdOn': 1, 
                          'type': 1
                        }
                      }
                    ], 
                    'as': 'answerData'
                  }
                }, {
                  '$unwind': {
                    'path': '$answerData'
                  }
                },{
                    '$sort': {
                      '_id': -1
                    }
                  },{
                  '$project': {
                    'issue': 1, 
                    'userId': 1, 
                    'session': 1, 
                    'userData': {
                      '$ifNull': [
                        {
                          '$arrayElemAt': [
                            '$userData', 0
                          ]
                        }, []
                      ]
                    }, 
                    'lawyerData': {
                      '$ifNull': [
                        {
                          '$arrayElemAt': [
                            '$lawyerData', 0
                          ]
                        }, []
                      ]
                    }, 
                    'answerData': 1, 
                    'createdOn': 1, 
                    'new': 1, 
                    'answersId': 1, 
                    'total_session': 1, 
                    'status': 1, 
                    'current_session_paid': 1, 
                    'session_completed': 1
                  }
                }, {
                  '$skip': 0
                }, {
                  '$limit': 10
                }
              ]
        )

        if (sessions) {
            res.status(200).json({ message: "Data Found Sucessfully...!", status: true, statusCode: 200, data: sessions, totalCount: totalCount })
        } else {
            res.status(400).json({ message: "Something went wrong...!", status: false, statusCode: 400 })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong...!", status: false, statusCode: 500 })
    }
});

router.patch('/requestToLawyer',async(req,res)=>{
    try {
        let {_id,booking_id,lawyerId,lawyerName} = req.body;
 
        let getSession = await sessionModel.findOne({_id,booking_id});
        let session = getSession.session;
        session.lawyerId = lawyerId;
        session.status = 2;
      
        let request = await sessionModel.findOneAndUpdate({_id,booking_id},{lawyerId,lawyerName,status:2,updatedOn: new Date(),session},{new:true});
        console.log('request :', request);
        if(request){
           return res.status(200).json({status:true,statusCode:200,data: request,message:"Request Sent To Lawyer Successfully."})
        }
        else{
           return res.status(400).json({ message: "Something Went Wrong..", status: false, statusCode: 400 })
        }
    } catch (error) {
    console.log('error :', error);
       return res.status(500).json({ message: "Something Went Wrong..", status: false, statusCode: 500 }) 
    }
});

router.patch('/allocateLawyer',async(req,res)=>{
    try {
        let {_id,booking_id,lawyerId,lawyerName} = req.body;
 
        let getSession = await sessionModel.findOne({_id,booking_id});
        let session = getSession.session;
        session.lawyerId = lawyerId;
        session.status = 4;
      
        let request = await sessionModel.findOneAndUpdate({_id,booking_id},{lawyerId,lawyerName,status:4,updatedOn: new Date(),session},{new:true});
        if(request){
           return res.status(200).json({status:true,statusCode:200,data: request,message:"Lawyer Allocated Successfully.."})
        }
        else{
           return res.status(400).json({ message: "Something Went Wrong..", status: false, statusCode: 400 })
        }
    } catch (error) {
    console.log('error :', error);
    return res.status(500).json({ message: "Something Went Wrong..", status: false, statusCode: 500 }) 
    }
});

router.patch('/markCompletedSession',async(req,res)=>{
    try {
        let {_id,booking_id} = req.body;
 
        let getSession = await sessionModel.findOne({_id,booking_id});
        let sessionCount = await sessionModel.find({booking_id}).count();
        let session = getSession.session;
        session.session_completed = true;
        session.status = 5;
        session.completedOn = new Date();
        current_session_paid = sessionCount == 1 ? false: true;
        booking_completed = sessionCount == 3 ? true: false;
        bookingCompletedOn = sessionCount == 3 ? new Date(): null;
        let request = await sessionModel.findOneAndUpdate({_id,booking_id},{total_session: sessionCount,current_session_paid,bookingCompletedOn,booking_completed,updatedOn: new Date(),session},{new:true});
        if(request){
           return res.status(200).json({status:true,statusCode:200,data: request,message:`${sessionCount} Session Completed`})
        }
        else{
           return res.status(400).json({ message: "Something Went Wrong..", status: false, statusCode: 400 })
        }
    } catch (error) {
    console.log('error :', error);
    return res.status(500).json({ message: "Something Went Wrong..", status: false, statusCode: 500 }) 
    }
});

router.get('/listForAdmin',async(req,res)=>{
    try {
        let match = {};
        if (req.query.id) match._id = mongoose.Types.ObjectId(req.query.id);
        let { page, limit } = req.query;
        let countData = await sessionModel.aggregate([
            {
                '$group': {
                  '_id': {
                    '$cond': [
                      {
                        '$eq': [
                          '$booking_id', null
                        ]
                      }, true, false
                    ]
                  }, 
                  'doc': {
                    '$first': '$$ROOT'
                  }
                }
              }
        ]);

        let sessions = await sessionModel.aggregate(
            [
                {
                  '$sort': {
                    '_id': -1
                  }
                }, {
                  '$group': {
                    '_id': {
                      '$cond': [
                        {
                          '$eq': [
                            '$booking_id', null
                          ]
                        }, true, false
                      ]
                    }, 
                    'doc': {
                      '$first': '$$ROOT'
                    }
                  }
                }, {
                  '$replaceRoot': {
                    'newRoot': '$doc'
                  }
                }, {
                  '$lookup': {
                    'from': 'answers', 
                    'localField': 'answersId', 
                    'foreignField': '_id', 
                    'as': 'answerData'
                  }
                }, {
                  '$unwind': {
                    'path': '$answerData'
                  }
                }, {
                  '$lookup': {
                    'from': 'users', 
                    'localField': 'userId', 
                    'foreignField': '_id', 
                    'as': 'userData'
                  }
                }, {
                  '$unwind': {
                    'path': '$userData'
                  }
                }
              ]
        )

        if (sessions) {
            res.status(200).json({ message: "Data Found Sucessfully...!", status: true, statusCode: 200, data: sessions, totalCount: countData.length })
        } else {
            res.status(400).json({ message: "Something went wrong...!", status: false, statusCode: 400 })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong...!", status: false, statusCode: 500 })

    }
})

router.get('/listForUser',async(req,res)=>{
    try {
        let match = {};
        if (req.query.id) match.userId = mongoose.Types.ObjectId(req.query.id);

        let sessions = await sessionModel.aggregate(
            [
                {
                  '$sort': {
                    '_id': -1
                  }
                }, {
                  '$match': match
                }, {
                  '$group': {
                    '_id': {
                      '$cond': [
                        {
                          '$eq': [
                            '$booking_id', null
                          ]
                        }, true, false
                      ]
                    }, 
                    'doc': {
                      '$first': '$$ROOT'
                    }
                  }
                }, {
                  '$replaceRoot': {
                    'newRoot': '$doc'
                  }
                }, {
                  '$lookup': {
                    'from': 'answers', 
                    'localField': 'answersId', 
                    'foreignField': '_id', 
                    'as': 'answerData'
                  }
                }, {
                  '$unwind': {
                    'path': '$answerData'
                  }
                }
              ]
        )

        if (sessions) {
            res.status(200).json({ message: "Data Found Sucessfully...!", status: true, statusCode: 200, data: sessions})
        } else {
            res.status(400).json({ message: "Something went wrong...!", status: false, statusCode: 400 })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong...!", status: false, statusCode: 500 })

    }
})

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

// router.patch('/allocateLawyer', async(req, res) => {
//     try {
//         const { _id, lawyerId, lawyerName } = req.body;
//         let request = await sessionModel.findByIdAndUpdate({ _id }, { $set: { lawyerId, lawyerName, status: 4, updatedOn: new Date() } }, { new: true });
//         if (request) {
//             return res.status(200).json({ status: true, statusCode: 200, data: request, message: "Lawyer Allocated Successfully...!" })
//         } else {
//             return res.status(400).json({ message: "Something Went Wrong...!", status: false, statusCode: 400 })
//         }
//     } catch (error) {
//         console.log('error :', error);
//         res.status(500).json({ message: "Something Went Wrong...!", status: false, statusCode: 500 })
//     }
// });


router.put('/update', async(req, res) => {
    try {
        const _id = mongoose.Types.ObjectId(req.body._id)
        let client = await sessionModel.findOne({ _id });
        let count = client.total_session + 1;
        if (count > 3) {
            return res.status(500).json({ message: "Maximum limit of Session is 3....!", status: false, statusCode: 500 })
        } else {
            const data = await sessionModel.updateOne({ _id },{$set: {current_session_paid: count == 1 ? false : true,current_session_paid: count >= 3 ? true: false}}, {
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
});

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
});


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
});

module.exports = router;