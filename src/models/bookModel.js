const mongooes = require('mongoose')

const {Schema} = mongooes

const BookModel = new Schema({
    owner : {
        type : Schema.Types.ObjectId,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    type : {
        type : String,
        required : true 
    },
    url : {
        type : String,
        required : true
    },
    lastUse : {
        type : Date,
        required : true, 
        default : Date.now
    }
}, {
    collection : "Books"
})

module.exports = mongooes.model("BookModel", BookModel)