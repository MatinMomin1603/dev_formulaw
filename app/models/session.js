const mongoose = require("mongoose");

const SessionScema = new mongoose.Schema({
    lawyerId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId
    },
    lawyerName: {
        type: String,
    },
    issue: {
        type: String
    },
    createdOn: {
        type: Date,
        default: new Date(),
    },
// status maintained for seesion
// 1-: pending * status updated by user
// 2-: requested  * status updated by Admin
// 3-: accepted * status updated by Lawyer
// 4-: allocated * status updated by Admin
// 0-: rejected * status updated by Lawyer
    session: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
        },
        createdOn: {
            type: Date,
            default: new Date(),
        },
        status: {
            type: Number
        },
        completedOn: {
            type: Date
        },
        lawyerId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        session_completed: {
            type: Boolean,
            default: false
        }
    },

    // userSessions:[{
    //    status: {
    //     type: Number,
    //     default: 1,
    //    },
    //    requestdOn: {
    //     type: Date,
    //     default: 1,
    //    }
    // }],

    updatedOn: {
        type: Date,
        default: new Date(),
    },
    new: {
        type: Boolean,
        default: false
    },
    total_session: {
        type: Number,
        default: 0
    },
    status: {
        type: Number,
        default: 1
    },
    answersId: {
        type: mongoose.Schema.Types.ObjectId
    },
    current_session_paid:{
        type: Boolean,
        default: true
    },
    booking_completed:{
        type: Boolean,
        default: false
    },
    bookingCompletedOn:{
        type: Date
    },
    payments: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
        },
        status: {
          type: String
        },
        paymentDateTime: {
          type: Date
        }
    },
    booking_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    language: {
        type: String
    }
});

module.exports = mongoose.model("session", SessionScema);