const express = require("express")
const router = express.Router()

const { signUpUser, signInUser, signOutUser, isAuthenticated, isSignedIn, isCommenter, isReplier } = require("../controllers/auth")
const { createComment, editComment, editReply, createReply, deleteComment, deleteReply, upvoteComment, downvoteComment, upvoteReply, downvoteReply } = require("../controllers/comment_controllers")
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
router.post('/:id/:title/comments', isSignedIn, createComment)
router.put('/:id/:title/comments/:commentId', isSignedIn, isCommenter, editComment)
router.delete('/:id/:title/comments/:commentId', isSignedIn, isCommenter, deleteComment)
router.post('/:id/:title/comments/:commentId/upvote', isSignedIn, upvoteComment)
router.post('/:id/:title/comments/:commentId/downvote', isSignedIn, downvoteComment)
router.post('/:id/"title/comments/:commentId/replies', isSignedIn, createReply)
router.put('/:id/:title/comments/:commentId/replies/:replyId', isSignedIn, isReplier, editReply)
router.delete('/:id/:title/comments/:commentId/replies/:replyId', isSignedIn, isReplier, deleteReply)
router.post('/:id/"title/comments/:commentId/replies/:replyId/upvote', isSignedIn, upvoteReply)
router.post('/:id/"title/comments/:commentId/replies/:replyId/downvote', isSignedIn, downvoteReply)

module.exports = router