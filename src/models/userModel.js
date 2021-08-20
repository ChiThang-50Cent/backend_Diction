const mongoose = require('mongoose')

const {Schema} = mongoose

const UserModel = new Schema({
    email : {
        type : String,
        required : true
    },
    username : {
        type : String,
        required : true
    },
    hash : {
        type : String,
        required : true
    },
    avatar : String
}, {
    collection : "Users"
})

module.exports = mongoose.model("UserModel", UserModel)