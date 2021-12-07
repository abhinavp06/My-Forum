const User = require("../models/user_model")
const Post = require("../models/post_model")
const Comment = require("../models/comment_model")

function postURLGenerator(postTitle){
    var res = postTitle
    res = res.replace(/\s+/g, '-');
    return res
}

function postURLHyphenRemover(postURLToBeEdited){
    var res = postURLToBeEdited
    res = res.replace(/-/g, ' ')
    return res
}

exports.createPost = async(req,res) => {
    
    const{ postTitle, postBody } = req.body
    const postedBy = await User.findById(req.user)
    
    if(!postedBy){
        return res.status(404).send({message: "User does not exist"})
    }

    const postURL= process.env.PROFILE_LINK_HEAD + process.env.PORT + '/' + req.user.username + '/' + postURLGenerator(postTitle)

    const newPost = new Post({
        postTitle,
        postBody,
        postURL,
        postedBy: postedBy._id,
        postPoints: 1,
        postedByUsername: req.user.username
    })

    try{
        await newPost.save()
        User.findByIdAndUpdate(req.user._id, 
            {$push:{"userPosts": newPost, "userPostLinks": newPost.postURL}},
            {safe:true, upsert:true},
            function(err,model){
                if(err)
                    return res.send(err)
                return res.json(`Post created. Post link: ${newPost.postURL}`)
            }
        )
        
    }catch(error){
        res.status(409).json({message: error.message})
    }


}

exports.editPost = async(req,res) => {

}

exports.deletePost = async(req,res) => {

}

exports.getPostByURL = async(req,res) => {
    var {id, title} = req.params
    var URLTitle = postURLHyphenRemover(title)
    try{
        User.findOne({username: id}, function(err,user){
            if(err){
                return res.json(err)
            }else{
                Post.find({postedBy: user._id , postTitle: URLTitle}, {'_id': 0, '__v': 0, 'updatedAt': 0, 'postURL': 0, 'postedBy': 0}, function(err, post){
                    if(err){
                        return res.json(err)
                    }else{
                        return res.json(post)
                    }
                })
            }
        })
    }catch(error){
        res.json(error)
    }
}

exports.getAllPosts = async(req,res) => {
    
}

exports.upvotePost = (req,res) => {

}

exports.downvotePost = (req,res) => {

}