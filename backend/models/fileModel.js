const mongoose = require('mongoose');


const fileSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
    },

    filename: {
        type: "String",
        require: [false, ''],
    },
    code: {
        type: "String",
        require: [true, ''],
    },
    commentId: {
        type: String,
        required: [false, ''],
    },
    removeComment: {
        type: Boolean,
        required: [false, ''],
    },
    comments: [{
        height: {
            type: Number,
            required: [false, ''],
        },
        title: {
            type: String,
            required: [false, ''],
        },
        input: {
            type: String,
            required: [false, ''],
        },
    }]

}, {
    timestamps: true,
});

module.exports = mongoose.model('Files', fileSchema)