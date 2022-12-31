const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: new Date()
    },
    link: {
        type: String
    },
    img: {
        type: String
    },
    imageUrl: {
        type: String
    },
    updatedOn: {
        type: Date,
        default: new Date()
    },
    displayOn: {
        type: Date,
        default: new Date()
    }
});

module.exports = mongoose.model('Articals', BlogSchema)