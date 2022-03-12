const express = require('express');
const router = express.Router();
const { RegisterUser, LoginUser, profile, getUser, getUsers, updateUser, deleteUser, userAuth } = require('../controller/user');
const { CreatePost, getPost, getPosts, updatePost, deletePost } = require('../controller/post');


router
.route('/sign-up')
.post(RegisterUser);

router
.route('/sign-in')
.post(LoginUser);

router
.get('/profile', userAuth, async(req, res) => {
    return res.json(profile(req.user));
});

router
.route('/user/:username')
.get(userAuth, getUser);

router
.route('/users')
.get(userAuth, getUsers);

router
.route('/user/update')
.patch(userAuth, async(req, res) => {
    await updateUser(req.user, req, res)
});

router
.route('/user/delete')
.delete(userAuth, async(req, res)=>{
    await deleteUser(req.user, req, res)
});

router
.route('/user/post')
.post(userAuth, async(req, res)=>{
    await CreatePost(req.user, req, res)
})


router
.route('/user/post/:id')
.get( userAuth, getPost)
.patch(userAuth, async(req, res)=>{
    await updatePost(req.user, req, res)
})
.delete(userAuth, async(req, res)=>{
    await deletePost(req.user, req, res)
})

router
.route('/user/posts')
.get(userAuth, getPosts);

module.exports = router;


