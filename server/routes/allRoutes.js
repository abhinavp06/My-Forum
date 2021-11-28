const express = require("express")
const router = express.Router()

const {signUpUser, signInUser, signOutUser, isAuthenticated, isSignedIn} = require("../controllers/auth")

// AUTHENTICATION ROUTES
router.post('/signup', signUpUser)
router.post('/signin', signInUser)
router.post('/signout', isSignedIn, signOutUser)

// USER ROUTES

// POST ROUTES

// COMMENTS AND REPLIES ROUTES


module.exports = router