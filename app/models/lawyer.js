const mongoose = require('mongoose');

const LawyerSchema = new mongoose.Schema({
    name: {
        type: String,
    },

    email: {
        type: String,
    },

    firmName: {
        type: String
    },

    specialization: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,

        },
        name: {
            type: String
        }
    }],

    otp: {
        type: Number
    },

    phoneNo: {
        type: String,
        required: true,
    },

    state: {
        type: String,
    },

    city: {
        type: String,
    },

    resume: {
        type: String,
    },

    experience: {
        type: String
    },

    langauge: {
        type: String,
    },

    createdOn: {
        type: Date,
        default: new Date()
    },

    updatedOn: {
        type: Date,
        default: new Date()
    },

    otp_generated_at: {
        type: Date,
        default: new Date()
    },

    gender: {
        type: String
    },

    login_last: {
        type: Date
    },

    is_login: {
        type: Boolean
    },

    lawyerimage: {
        type: String
    },

    isApproved: {
        type: String,
        default: "pending"
    },
    
    is_Online: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('lawyer', LawyerSchema)