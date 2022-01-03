const mongoose = require("mongoose")

const replySchema = new mongoose.Schema(
    {
        repliedBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        repliedByUsername: {
            type: String
        },
        replyBody:{
            type: String,
            trim: true
        },
        replyPoints:{
            type: Number,
            default: 1
        },
        repliedTo:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    },
    {timestamps: true}
)

module.exports = mongoose.model("Reply", replySchema)
