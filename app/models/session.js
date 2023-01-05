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

    session: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
        },
        count: {
            type: Number
        },
        createdOn: {
            type: Date,
            default: new Date(),
        },
    }],
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
    }
});

module.exports = mongoose.model("session", SessionScema);