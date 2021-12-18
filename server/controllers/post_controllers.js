const User = require("../models/user_model")
const Post = require("../models/post_model")

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

exports.createPost = async(req,res) => {
    
    const{ postTitle, postBody } = req.body
    const postedBy = await User.findById(req.user)
    
    if(!postedBy){
        return res.status(404).send({message: "User does not exist"})
    }

    const postURL= process.env.PROFILE_LINK_HEAD + process.env.PORT + '/' + req.user.username + '/' + URLGenerator(postTitle)

    const newPost = new Post({
        postTitle,
        postBody,
        postURL,
        postedBy: postedBy._id,
        postPoints: 1,
        postedByUsername: req.user.username,
        upvotedBy: req.user._id,
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

// Have to implement enabling user to edit post title which will change the url of the post and reflect that in the user schema as well
exports.editPost = async(req,res) => {
    // router.put('/:id', async (req, res) => {
    //     const { error } = validateProduct(req.body); 
    //     if (error) return res.status(400).send(error.details[0].message);
      
    //     const product = await Product.findById(req.params.id).exec();
    //     if (!product) return res.status(404).send('The product with the given ID was not found.');
      
    //     let query = {$set: {}};
    //     for (let key in req.body) {
    //       if (product[key] && product[key] !== req.body[key]) // if the field we have in req.body exists, we're gonna update it
    //          query.$set[key] = req.body[key];
      
    //     const updatedProduct = await Product.updateOne({_id: req.params.id}, query}).exec();
      
    //     res.send(product);
    //   });
    const {id, title} = req.params
    const URLTitle = URLHyphenRemover(title)

    // const newBody = req.body
    var input = JSON.stringify(req.body);

    var fields = input.split('"');

    var newBody = fields[3];

    Post.findOne({postTitle: URLTitle}, function(err,post){
        if(err){
            return res.json(`Failed to update post.`)
        }else{
            post.postBody = newBody
            post.save()
            return res.json(`Post updated!`)
        }
    })
    
}

// Have to implement deletion of post details from author's schema
exports.deletePost = async(req,res) => {
    const {id,title} = req.params

    var postTitleToBeDeleted = URLHyphenRemover(title)

    Post.findOneAndDelete({postTitle: postTitleToBeDeleted}, function(err,post){
        if(err){
            res.json(`Post does not exist.`)
        }else{
            post.delete()
            return res.json(`Post deleted`)
        }
    })
}

exports.getPostByURL = async(req,res) => {
    var {id, title} = req.params
    var URLTitle = URLHyphenRemover(title)
    try{
        // User.findOne({username: id}, function(err,user){
        //     if(err){
        //         return res.json(`Post/User not found`)
        //     }else{
        //         Post.find({postedBy: user._id , postTitle: URLTitle}, {'_id': 0, '__v': 0, 'updatedAt': 0, 'postURL': 0, 'postedBy': 0, 'upvotedBy': 0}, function(err, post){
        //             if(err){
        //                 return res.json(`Post not found!`)
        //             }else{
        //                 return res.json(post)
        //             }
        //         })
        //     }
        // })
        Post.findOne({postTitle: URLTitle}, function(err,post){
            if(err || post == null){
                return res.json(`Post not found.`)
            }else{
                return res.json(post)
            }
        })
    }catch(error){
        res.json(error)
    }
}

exports.getAllPosts = async(req,res) => {
    const x = await Post.find()

    res.json(x)
}

exports.upvotePost = (req,res) => {

    const {id,title} = req.params

    TitleForPost = URLHyphenRemover(title)
    Post.findOne({postTitle: TitleForPost}, function(err,post){
        if(err){
            res.json(err)
        }else{
            post.postPoints = post.postPoints + 1
            post.save()
            return res.json(`Post upvoted.`)
        }
    })

}

exports.downvotePost = (req,res) => {

    const {id,title} = req.params

    TitleForPost = URLHyphenRemover(title)
    Post.findOne({postTitle: TitleForPost}, function(err,post){
        if(err){
            res.json(err)
        }else{
            post.postPoints = post.postPoints - 1
            post.save()
            return res.json(`Post upvoted.`)
        }
    })
}