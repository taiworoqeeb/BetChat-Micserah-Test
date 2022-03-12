const mongoose = require("mongoose");



const PostSchema = new mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    } 
},
{
    timestamps: true
});

module.exports = mongoose.model('Posts', PostSchema);
