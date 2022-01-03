const User = require("../models/user_model")
const Post = require("../models/post_model")
const Comment = require("../models/comment_model")
const Reply = require("../models/reply_model")


function URLGenerator(Title){
    var res = Title
    res = res.replace(/\s+/g, '-')
    return res
}

function URLHyphenRemover(URLToBeEdited){
    var res = URLToBeEdited
    res = res.replace(/-/g, ' ')
    return res
}

exports.createComment = (req,res) => {

    const {id, title} = req.params
    const{ commentBody } = req.body
    const commentedBy = User.findById(req.user)
    
    if(!commentedBy){
        return res.status(404).send({message: "User does not exist"})
    }

    const newComment = new Comment({
        commentedBy: req.user,
        commentPoints: 1,
        commentedByUsername: req.user.username,
        commentBody: commentBody
    })

    try{
        newComment.save()
        // const postURL = process.env.PROFILE_LINK_HEAD + process.env.PORT + '/' + id + '/' + title
        const postTitleToBeFound = URLHyphenRemover(title)
        // console.log(postURL)
        const commentURL= process.env.PROFILE_LINK_HEAD + process.env.PORT + '/' + id + '/' + title + '/comments/' + newComment._id

        var finalRes = "Comment Added"
        // adding comment link to commenter's comment link array and comment to commenter's comment array
        User.findByIdAndUpdate(req.user._id, 
            {$push:{"userPostCommentLinks":commentURL, "userComments": newComment}},
            {safe: true, upsert: true},
            function(err,doc){
                if(err)
                    return res.json(err)
                    // finalRes = err
                else{
                    // Post.findOne({postTitle: postTitleToBeFound},
                    //     {$push:{"postComments":newComment}},
                    //     {safe: true, upsert: true},
                    //     function(err,doc){
                    //         if(err)
                    //             return res.json(err)
                    //             // finalRes = err
                    //         else
                    //             return res.status(200).json("Comment Added")
                    //         //     finalRes = "Comment added"
                    //     }
                    // )
                    Post.findOne({postTitle: postTitleToBeFound}, function(err, post){
                        if(err)
                            return res.json(err)
                        else{
                            post.postComments.push(newComment)
                            post.postTotalComments = post.postTotalComments + 1
                            post.save()
                            return res.json("Comment Added")
                        }
                    })
                }
            })

        // adding comment to post's comment array
        // Post.findByIdAndUpdate({postLink: postURL},
        //     {$push:{"postComments":newComment}},
        //     {safe: true, upsert: true},
        //     function(err,doc){
        //         if(err)
        //             // return res.json(err)
        //             finalRes = err
        //         else
        //             // return res.status(200)
        //             finalRes = "Comment added"
        //     }
        //     )
    }catch(error){
        res.status(409).json({message: error.message})
    }
}

exports.editComment = (req,res) => {
    const {commentId} = req.params

    var input = JSON.stringify(req.body);
    var fields = input.split('"');
    var newBody = fields[3];

    Comment.findByIdAndUpdate(commentId, {commentBody: newBody}, function(err,comment){
        if(err)
            return res.json(err)
        else{
            return res.status(200).json(`Comment updated!`)
        }
    })
}

exports.deleteComment = (req,res) => {
    const {commentId} = req.params
    Comment.findByIdAndDelete(commentId, function (err, comment) {
        if (err){
            res.json(err)
        }
        else{
            res.status(400).json(`Comment deleted`)
        }
    })
}

exports.upvoteComment = (req,res) => {
    const {commentId} = req.params

    Comment.findByIdAndUpdate(commentId, function(err,comment){
        if(err)
            res.json(err)
        else{
            comment.commentPoints = comment.commentPoints + 1
            comment.save()
            return res.json(`Comment upvoted.`)
        }
    })
}

exports.downvoteComment = (req,res) => {
    const {commentId} = req.params

    Comment.findByIdAndUpdate(commentId, function(err,comment){
        if(err)
            res.json(err)
        else{
            comment.commentPoints = comment.commentPoints - 1
            comment.save()
            return res.json(`Comment downvoted.`)
        }
    })
}

exports.createReply = (req,res) => {
    const {title, commentId} = req.params

    const {replyBody} = req.body
    
    const newReply = new Reply({
        repliedBy: req.user,
        replyPoints: 1,
        repliedByUsername: req.user.username,
        replyBody: replyBody,
        repliedTo: commentId
    })

    try{
        newReply.save()
    }catch(err){
        return res.json(err)
    }

    const postTitleToBeFound = URLHyphenRemover(title)

    Post.findOne({postTitle: postTitleToBeFound}, function(err,post){
        if(err)
            return res.json(err)
        else{
            post.postTotalComments = post.postTotalComments + 1
            post.save()
            Comment.findByIdAndUpdate(commentId, function(err,comm){
                if(err)
                    return res.json(err)
                else{
                    comm.commentReplies.push(newReply)
                    comm.save()
                    return res.status(200).json(`Created reply.`)
                }
            })
        }
    })


}

exports.editReply = (req,res) => {
    const {replyId} = req.params

    var input = JSON.stringify(req.body);
    var fields = input.split('"');
    var newBody = fields[3];

    Reply.findByIdAndUpdate(replyId, {replyBody: newBody}, function(err,reply){
        if(err)
            return res.json(err)
        else{
            return res.status(200).json(`Reply updated!`)
        }
    })
}

exports.deleteReply = (req,res) => {
    const {replyId} = req.params
    Reply.findByIdAndDelete(replyId, function (err, reply) {
        if (err){
            res.json(err)
        }
        else{
            res.status(400).json(`Reply deleted`)
        }
    })
}

exports.upvoteReply = (req,res) => {
    const {replyId} = req.params

    Reply.findByIdAndUpdate(replyId, function(err,reply){
        if(err)
            res.json(err)
        else{
            reply.replyPoints = reply.replyPoints + 1
            reply.save()
            return res.json(`Reply upvoted.`)
        }
    })
}

exports.downvoteReply = (req,res) => {
    const {replyId} = req.params

    Reply.findByIdAndUpdate(replyId, function(err,reply){
        if(err)
            res.json(err)
        else{
            reply.replyPoints = reply.replyPoints - 1
            reply.save()
            return res.json(`Reply downvoted.`)
        }
    })
}
