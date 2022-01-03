const User = require("../models/user_model")
const passport = require("passport")
const Comment = require("../models/comment_model")
const Reply = require("../models/reply_model")


// CUSTOM METHOD TO GENERATE PROFILE LINK
function profileLinkGenerator(username){
    return process.env.PROFILE_LINK_HEAD + process.env.PORT + '/' + username
}

exports.signUpUser = async (req,res) => {
    
    const { username, name, email, password } = req.body;

    const profileLink = profileLinkGenerator(username)

    const newUser = new User({ username, name, email, password, profileLink })

    try {
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

exports.signInUser = async (req, res, next) => {
    passport.authenticate("local", function(err, user, info) {
        if(err) {
            return res.status(400).json({ errors: err})
        }
        if(!user) {
            return res.status(400).json({errors: "No user found"})
        }
        req.logIn(user , function(err){
            if(err){
                return res.status(400).json({ errors: err})
            }
            return res.status(200).json({ success: `Logged in ${user.username}`})
        })
    })(req,res,next)
}

exports.signOutUser = async (req,res) => {
    req.logout()
    return res.status(200).json({ success: 'Logged out successfully'})
}

exports.isAuthenticated = async (req, res, next) => {
    const {id} =req.params; 
    if(req.user.username == id){
        next();
    }else{
        res.json(`You are not allowed to edit other's profiles`)
    }
}

exports.isCommenter = (req,res,next) => {
    const {commentId} = req.params
    // var commenter = " "
    // Comment.findById(commentId, function(err,docs){
    //     // console.log(docs.commentedByUsername)
    //     if(err)
    //         res.json(err)
    //     else
    //         commenter = docs.commentedByUsername
    // })
    // console.log(commenter)
    // if(commenter == req.user.username){
    //     next()
    // }else{
    //     res.json("You cannot modify someone's comment.")
    // }
    Comment.findById(commentId, function(err,comment){
        if(err){
            res.json(err)
        }else{
            if(comment.commentedByUsername == req.user.username){
                next()
            }else{
                return res.json(`You cannot modify other's comments.`)
            }
        }
    })
}

exports.isReplier = (req,res,next) => {
    const {replyId} = req.params
    Reply.findById(replyId, function(err,reply){
        if(err){
            res.json(err)
        }else{
            if(reply.repliedByUsername == req.user.username){
                next()
            }else{
                return res.json(`You cannot modify other's replies.`)
            }
        }
    })
}

exports.isSignedIn = async(req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.json('Please sign in first.')
    }
}
