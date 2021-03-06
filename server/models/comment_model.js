const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema(
    {
        commentedBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        commentedByUsername:{
            type: String
        },
        commentBody:{
            type: String,
            trim: true
        },
        commentPoints:{
            type: Number,
            default: 1
        },
        commentReplies:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reply'
        }]
    },
    {timestamps: true}
)

module.exports = mongoose.model("Comment", commentSchema)