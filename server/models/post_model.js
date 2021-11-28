const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    postTitle: {
        type: String,
        required: true,
        maxlength: 100,
        trim: true
    },
    postBody:{
        type: String,
        required: true,
        trim: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    postPoints: {
        type: Number,
        default: 1
    },
    postComments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    postCommentsandRepliesCount: {
        type: Number,
        default: 0
    },
    timestamps: true
})

module.exports = mongoose.model("Post", postSchema)