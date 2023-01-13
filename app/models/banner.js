const mongoose = require('mongoose');
const BannerSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    icon: {
        type: String,
    },

    link: {
        type: String,
    },
    imageUrl: {
        type: String

    },
    createdOn: {
        type: Date,
        default: new Date()
    },
    updatedOn: {
        type: Date,
        default: new Date()
    },
    type: {
        type: String
    },
    status: {
        type: Boolean
    }

});

module.exports = mongoose.model('banner', BannerSchema)