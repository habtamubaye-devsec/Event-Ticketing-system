const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true 
    },
    profilePicture: {
        type: String,
        default: ""
    },
    isAdmin: {
        type: Boolean,
        required: false,
        default: false
    }
}, { timestamps: true});

module.exports = mongoose.model("User", userSchema); 