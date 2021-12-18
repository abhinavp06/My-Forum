const express = require("express")
const router = express.Router()

const { signUpUser, signInUser, signOutUser, isAuthenticated, isSignedIn } = require("../controllers/auth")
const { createPost, getAllPosts, getPostByURL, upvotePost, downvotePost, editPost, deletePost } = require("../controllers/post_controllers")
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
router.get('/', getAllPosts)
router.get('/:id/:title', getPostByURL)
router.post('/:id/:title/upvote', isSignedIn, upvotePost)
router.post('/:id/:title/downvote', isSignedIn, downvotePost)
router.put('/:id/:title', isSignedIn, isAuthenticated, editPost)
router.delete('/:id/:title', isSignedIn, isAuthenticated, deletePost)

// COMMENTS AND REPLIES ROUTES


module.exports = router