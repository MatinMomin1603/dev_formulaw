const mongoose = require('mongoose');

const specialitiesSchema = new mongoose.Schema({
    name: {
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
});






module.exports = mongoose.model('specialities', specialitiesSchema)