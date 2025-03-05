const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ["Manager", "Operator"],
        required: true,
        default: 'Manager'
    },
    department: {
        type: String,
        enum: ["Assembly", "Quality Control"],
        required: true,
        default: 'user'
    }
}, { timestamps: true })

const User = mongoose.model("User", UserSchema);

module.exports = User;