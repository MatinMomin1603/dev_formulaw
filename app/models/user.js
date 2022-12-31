const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    phoneNo: {
        type: String,
        required: true,
        unique: true,
    },
    otp: {
        type:Number
    },
    otp_generated_at: {
        type: Date,
        default: new Date()
    },
    createdOn: {
        type: Date,
        default: new Date()
    },
    updatedOn: {
        type: Date,
        default: new Date()
    },
    login_last:{
        type: Date
    },
    is_login: {
        type: Boolean
    },
    
    pincodeNo:{
        type: String
    },

    gender: {
        type: String
    },

    profileImage: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('user',userSchema);