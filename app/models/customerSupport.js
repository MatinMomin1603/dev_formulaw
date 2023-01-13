const mongoose = require('mongoose')

const consultation = new mongoose.Schema({


    question: {
        type: String
    },

    answer: {
        type: String
    },

    type: {
        type: String
    },

    createdOn: {
        type: Date,
        default: new Date()
    }

})

module.exports = mongoose.model('customersupports', consultation)