const express = require("express")
const router = express.Router()

const {signUpUser, signInUser, signOutUser, isAuthenticated, isSignedIn} = require("../controllers/auth")
const { createPost, getPostByURL } = require("../controllers/post_controllers")
const { getUsersPosts, getUsersComments, showUserProfile } = require("../controllers/user_controllers")

// AUTHENTICATION ROUTES
router.post('/signup', signUpUser)
router.post('/signin', signInUser)
router.post('/signout', isSignedIn, signOutUser)

// USER ROUTES
router.get('/:id', showUserProfile)
router.get('/:id/posts', getUsersPosts)
router.get('/:id/comments', getUsersComments)
router.get('/:id/posts', getUsersPosts)

// POST ROUTES
router.post('/', isSignedIn, createPost)
router.get('/:id/:title', getPostByURL)

// COMMENTS AND REPLIES ROUTES


module.exports = router