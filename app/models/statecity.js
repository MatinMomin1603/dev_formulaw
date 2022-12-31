const mongoose = require('mongoose');

const statecitySchema = mongoose.Schema({
    state:{
        type:String
    },
    city: {
        type: [],
    },
    createdOn:{
        type: Date,
        default: new Date()
    }
})

module.exports = mongoose.model('statecities',statecitySchema);