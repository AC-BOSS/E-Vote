const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    isAdmin:{
        type: Boolean,
        required: true
    },
    verified:{
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model("User", UserSchema);