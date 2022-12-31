const mongoose = require('mongoose');
var ObjectID = require('mongodb').Objectid;

const questionSchema  = mongoose.Schema({
     type:{
        type:String,
     },
     question:{
        type:String,
     },
     createdOn:{
        type: Date,
        default: new Date()
     },
     updatedOn:{
        type: Date,
        default: new Date()
     },
     nextQuestionId: {
        type: mongoose.Schema.Types.ObjectId
     },
     options: [{
           _id: mongoose.Schema.Types.ObjectId,
           option: {
            type:String
           },

           createdOn:{
            type: Date,
            default: new Date()
         },
         updatedOn:{
            type: Date,
            default: new Date()
         },
     }]
})


module.exports = mongoose.model('questions',questionSchema);