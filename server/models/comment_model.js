const mongoose = require("mongoose")

const replySchema = new mongoose.Schema(
    {
        repliedBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        repliedBody:{
            type: String,
            trim: true
        },
        repliedPoints:{
            type: Number,
            default: 1
        }
    },
    {timestamps: true}
)


const commentSchema = new mongoose.Schema(
    {
        commentedBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        commentBody:{
            type: String,
            trim: true
        },
        commentPoints:{
            type: Number,
            default: 1
        },
        commentReplies:[replySchema]
    },
    {timestamps: true}
)

module.exports = mongoose.model("Comment", commentSchema)