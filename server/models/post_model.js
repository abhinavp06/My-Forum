const mongoose = require("mongoose")

const postSchema = new mongoose.Schema(
    {
        postTitle: {
            type: String,
            required: true,
            maxlength: 100,
            trim: true,
            unique: true
        },
        postURL: String,
        postBody:{
            type: String,
            required: true,
            trim: true
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        postedByUsername: {
            type: String
        },
        postPoints: {
            type: Number,
            default: 1
        },
        // upvotedBy:[{
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'User'
        // }],
        // upvotedByUsernames: [{
        //     type: String
        // }],
        postComments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }],
        postTotalComments: {
            type: Number,
            default: 0
        }
    },
    {timestamps: true}
)

module.exports = mongoose.model("Post", postSchema)