const User = require("../models/user_model")

exports.showUserProfile = async (req,res) => {
    const {id} = req.params 
    User.find({username: id}, {'_id': 0, 'email': 0, 'password': 0, '__v': 0, 'createdAt': 0, 'updatedAt': 0, 'userPosts': 0, 'userComments': 0, 'userPostCommentLinks': 0 }, function(err, docs) { 
        if(err){
            res.json(err)
        }else{
            res.json(docs)
        }
    })
}

exports.getUsersPosts = async(req,res) => {
    const {id} = req.params
    User.find({username: id}, {'_id': 0, 'password': 0, '__v': 0, 'createdAt': 0, 'updatedAt': 0, 'username': 0, 'name': 0, 'email': 0, 'profileLink': 0, 'userPosts': 0, 'userComments': 0, 'userPostCommentLinks': 0}, function(err, docs) { 
        if(err){
            res.json(err)
        }else{
            res.json(docs)
        }
    })
}

exports.getUsersComments = async(req,res) => {
    const {id} = req.params
    User.find({username: id}, {'_id': 0, 'password': 0, '__v': 0, 'createdAt': 0, 'updatedAt': 0, 'username': 0, 'name': 0, 'email': 0, 'profileLink': 0, 'userPosts': 0, 'userComments': 0, 'userPostLinks': 0}, function(err, docs) { 
        if(err){
            res.json(err)
        }else{
            res.json(docs)
        }
    })
}
