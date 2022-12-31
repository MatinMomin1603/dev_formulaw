const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
    },

    password: {
        type: String,
    },

    type: {
        type: String,

    },

    email: {
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

    login_last:{
        type: Date
    },

    is_login: {
        type: Boolean
    }
});

module.exports = mongoose.model('admin', AdminSchema)
