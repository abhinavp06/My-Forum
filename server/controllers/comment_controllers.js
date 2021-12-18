const User = require("../models/user_model")
const Post = require("../models/post_model")
const Comment = require("../models/comment_model")
const passport = require("passport")

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
    const commentedBy = await User.findById(req.user)
    
    if(!commentedBy){
        return res.status(404).send({message: "User does not exist"})
    }

    const newComment = new Comment({
        commentedBy: commentedBy._id,
        commentPoints: 1,
        commentedByUsername: req.user.username
    })

    try{
        await newComment.save()
        const postURL = process.env.PROFILE_LINK_HEAD + process.env.PORT + '/' + req.user.username + '/' + URLGenerator(title)
        const commentURL= process.env.PROFILE_LINK_HEAD + process.env.PORT + '/' + req.user.username + '/' + URLGenerator(title) + '/comments' + newComment._id
        
        // User.findByIdAndUpdate(req.user._id, 
        //     {$push:{"userComments": newComment, "userPostCommentLinks": commentURL}},
        //     {safe:true, upsert:true},
        //     function(err,model){
        //         if(err)
        //             return res.send(err)
        //         return res.json(`Post created. Post link: ${newPost.postURL}`)
        //     }
        // )
        
        // User.findOne({username: id}, function(err,user){
        //     if(err){
        //         return res.json(err)
        //     }else{
        //         Post.find({postedBy: user._id , postTitle: URLTitle}, {'_id': 0, '__v': 0, 'updatedAt': 0, 'postURL': 0, 'postedBy': 0}, function(err, post){
        //             if(err){
        //                 return res.json(err)
        //             }else{
        //                 return res.json(post)
        //             }
        //         })
        //     }
        // })

        // If post creator is commenting
        if(req.user.username === id){

        }
        // If some other user is commenting
        else{

        }
        
    }catch(error){
        res.status(409).json({message: error.message})
    }
}