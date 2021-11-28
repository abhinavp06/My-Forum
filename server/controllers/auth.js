const User = require("../models/user_model")
const passport = require("passport")

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

exports.isSignedIn = async(req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.json('Please sign in first.')
    }
}
