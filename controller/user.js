const bcrypt = require('bcryptjs');
const UserModel = require('../model/Usermodel');
const jwt = require('jsonwebtoken');
const dotenv =  require('dotenv');
dotenv.config();
const passport= require('passport');


exports.RegisterUser = async (req, res) => {

        const { fullname, username, email, interests, password} = req.body;
        
    
    try{

        let user = await UserModel.findOne({ email });
        if(user){
            res.status(403).json("user already exist")
        } else{
            const salt = await bcrypt.genSalt(12);
            const hashedPass = await bcrypt.hash(password, salt);
            user = new UserModel({
                fullname,
                username,
                email,
                interests,
                password: hashedPass
            });
        
            await user.save();
            res.status(201).json({
                status: "success",
                user
            });
        }
        

    } catch(err){
        console.log(err);
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
};

exports.LoginUser = async (req, res) => {
    try{

        const { username, password }= req.body;

        let user = await UserModel.findOne({username: username});
        if(!user){
            return res.status(404).json({
                message: 'user does not exist',
                success: false
            });
        }

        const validate = await bcrypt.compare(password, user.password);
        if(validate){
            let token = jwt.sign(
                { 
                fullname: user.fullname,
                email: user.email, 
                username: user.username,  
                user_id: user._id }, 
                process.env.TOKEN, { expiresIn: "24h"});

            let result = {
                fullname: user.fullname,
                username: user.username,
                token: `Bearer ${token}`,
                expiresIn: 24
            };

            return res.status(200).json({
                ... result,
                status: "successfully logged in",
                success: true
            });

        } else{
           return res.status(403).json({
                message: 'wrong password',
                success: false
            });
        }


    } catch(err){
        return res.status(400).json({
            status: 'fail',
            message: err
          });
    }
};


exports.userAuth = passport.authenticate('jwt', {session: true});



exports.profile = user => {
   return {
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        interests: user.interests,
        _id: user._id,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt
       };

};

exports.getUsers = async (req, res)=>{
    try {
        const users = await UserModel.find().populate('posts')
       return res.status(200).json(users)
    } catch (error) {
        return res.status(404).json({
            message: "Not Found",
            error
        })
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await UserModel.findOne({username: req.params.username}).populate('posts')
       return res.status(200).json(user)

    } catch (error) {
       return res.status(404).json({
            message: "Not Found",
            error
        })
    }
};

exports.updateUser = async(user, req, res) => {
    try{
        if(user){
            const Updateuser = await UserModel.findOneAndUpdate({email: user.email}, req.body);
            return res.status(201).json({
                 message: "updated successfully",
             })
        } else{
            res.status(401).json("Please log in")
        }
       
    } catch(error){
       return res.status(400).json({
            message: "Not Found",
            error
        })
    }
}

exports.deleteUser = async(user, req, res) => {
    try{
        if(user){
            const userdelete = await UserModel.findOneAndDelete({email: user.email});
            return res.status(200).json({
                message: "deleted successfully",
                user: userdelete
            })
        } else{
            res.status(401).json("Please log in to delete your account")
        }
        
    } catch(error){
       return res.status(400).json({
            message: "Not Found",
            error
        })
    }
};

