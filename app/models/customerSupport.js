const mongoose = require('mongoose')

const consultation = new mongoose.Schema({
    question: {
        type: String
    },

    answer: {
        type: String
    },

    typeId: {
        type: mongoose.Schema.Types.ObjectId
    },

    createdOn: {
        type: Date,
        default: new Date()
    }

})

module.exports = mongoose.model('customersupports', consultation)