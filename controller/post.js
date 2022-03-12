const User = require('../model/Usermodel');
const Post = require('../model/Postmodel');
require('dotenv').config();

exports.CreatePost = async(user, req, res) => {
    const {title, description} = req.body;
    try {
        if(user){
            const userinfo = await User.findById(user._id)
        
            if(userinfo){
                const post = new Post({
                    title,
                    description,
                    user: userinfo._id
                });
                await post.save();

                userinfo.posts.push(post);
                await userinfo.save();

                res.status(201).json({
                    post: post
                });
            } else{
                res.status(404).json("User not found");
            }
        
    } else{
        res.status(401).json("Please Log in to post")
    }
    } catch (error) {
        res.status(500).json(
            {
                msg: "failed",
                error
            }
        )
    }
};

exports.getPosts = async(req, res)=>{
    try {
        const posts = await Post.find().populate('user');
        console.log(posts)
        return res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({
            msg: error
        });
    }
}

exports.getPost = async(req, res)=>{
    try {
        const post = await Post.findById(req.params.id)
        if(post){
            res.status(200).json(post)
        } else{
            res.status(404).json("Post not found")
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: error
        });
    }
}

exports.updatePost = async(user, req, res)=>{
    //const {title} = req.body as PostDocument
    try{
        if(user){
        const post = await Post.findByIdAndUpdate(req.params.id, req.body)
        res.status(201).json({
            status: "Updated successfully",
        })
        } else{
            res.status(401).json("Please login before you update post")
        }
    } catch(err){
        res.status(500).json({
            msg: err
        });
    }
}

exports.deletePost = async(user, req, res) =>{
    try {
        if(user){
        const post = await Post.findByIdAndDelete(req.params.id)
        res.status(200).json({
            status: "Post deleted",
        })
        } else{
            res.status(401).json("please login to delete post")
        }
        } catch (error) {
            res.status(500).json({
                msg: error
            });
    }
}