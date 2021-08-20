const mongooes = require('mongoose')

const { Schema } = mongooes

const GroupModel = new Schema({
    owner : {
        type : Schema.Types.ObjectId,
        required : true
    },
    word : {
        type : [Schema.Types.ObjectId],
        required : true
    },
    name : {
        type : String,
        required : true
    },
    shared : {
        type : Boolean,
        default : false,
        required : true
    },
    isDeleted : {
        type : Boolean,
        default : false,
        required : true
    },
    topic : [String]
}, {
    collection : "Groups"
})

module.exports = mongooes.model( "GroupModel", GroupModel)