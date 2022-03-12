const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
    fullname: {
        type: String,
        trim: true,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        min: 3,
        max: 20
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 20
    },
    interests: {
        type: [String],
        required: true
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Posts'
    }]

    },
{timestamps: true}
);

module.exports = new mongoose.model("User", UserSchema);
