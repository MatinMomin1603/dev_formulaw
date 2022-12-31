const express = require('express')
const router = express.Router();
const mongoose = require('mongoose');

const sessionSchema = require('../../models/session');


router.post('/add', async(req, res) => {
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
        const data = new sessionSchema({
            userId: mongoose.Types.ObjectId(userId),
            // lawyerId: mongoose.Types.ObjectId(lawyerId),
            // lawyerName: lawyerName,
            issue: issue,
            // session: session,
            answersId: answersId,
            new: true
        });
        let get = await data.save()
        if (get) {
            res.status(200).json({ message: "Session added sucessfully....!", status: true, statCode: 200, })
        } else {
            res.status(400).json({ message: "Something went wrong", status: false, statCode: 400, })

        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong", status: false, statuCode: 500 })

    }
});

function validation(key) {
    if (key == undefined || key == null || key == '') {
        return false
    } else return true;
}


router.get('/get', async(req, res) => {
    try {

        let client = await sessionSchema.aggregate(
            [{
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
                }
            }]
        )
        if (client) {
            res.status(200).json({ message: "Data Found Sucessfully...!", status: true, statCode: 200, data: client })
        } else {
            res.status(400).json({ message: "Something went wrong...!", status: false, statusCode: 400 })
        }

    } catch (error) {
        res.status(500).json({ message: "something went wrong...!", status: false, statusCode: 500 })

    }

});


router.put('/update', async(req, res) => {
    try {
        const _id = mongoose.Types.ObjectId(req.body._id)

        let client = await sessionSchema.findOne({ _id });
        let count = client.session.length + 1;

        if (count > 2) {
            return res.status(500).json({ message: "Maximum limit of Session is 2....!", status: false, statusCode: 500 })
        } else {
            const data = await sessionSchema.updateOne({ _id }, {

                "$push": {
                    "session": {
                        _id: mongoose.Types.ObjectId(),
                        count: count,
                        createdOn: new Date()

                    }
                }
            })

            if (data) {
                res.status(200).json({ message: "updated", status: true, statCode: 200 });

            } else {
                res.status(400).json({ messsage: "Not found...", status: false, statCode: 400 })
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong...", status: false, statCode: 500 })

    }
})

//update count
router.put('/updateCount', async(req, res) => {
    try {

        const _id = mongoose.Types.ObjectId(req.body._id)
        let get = await sessionSchema.updateOne({ "session._id": _id }, {
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

        const get = await sessionSchema.deleteOne({ _id });
        if (get) {
            res.status(200).json({ message: "Session Deleted Sucessfully...!", status: true, statCode: 200 });
        } else {
            res.status(400).json({ message: "something went wrong...!", status: false, statCode: 400, error });
        }
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ message: "Something went wrong", status: false, statCode: 500 })

    }
})

module.exports = router;