const mongoose = require('mongoose');

const answerSchema = mongoose.Schema({
        type: {
            type: String
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId
        },
        answers: [{
            questionId: {
            type: mongoose.Schema.Types.ObjectId
            },
            optionId: {
            type: mongoose.Schema.Types.ObjectId
            },
            manulAnswer: {
              type: String
            },
            createdOn: {
                type: Date,
                default: new Date()
            }
        }]
});

module.exports = mongoose.model('answers',answerSchema);