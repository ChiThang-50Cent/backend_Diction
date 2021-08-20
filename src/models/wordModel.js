const mongooes = require('mongoose')

const { Schema } = mongooes

const Word = new Schema({
    word: {
        type: String,
        required: true
    },
    phonetic: {
        type: String,
        required: true
    },
    kind: {
        type: String,
        required: true
    },
    sounds: {
        mp3: String,
        ogg: String,
    },
    defineAndExample: [
        {
            define: String,
            examples: [String]
        }
    ],
    idioms: [
        {
            idiom: String,
            defineAndExample: [
                {
                    define: String,
                    examples: [String]
                }
            ]
        }
    ]
}, {
    collection: "Words"
})

module.exports = mongooes.model("Word", Word)