const mongoose = require('mongoose')

const askQuestionSchema = new mongoose.Schema({


    question: {
        type: String
    },

    answer: {
        type: String
    },

    isAnswered: {
        type: Boolean,
        default: false
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId
    },

    createdOn: {
        type: Date,
        default: new Date()
    },

    answeredOn: {
        type: Date,
    },

})

module.exports = mongoose.model('askquestions', askQuestionSchema)