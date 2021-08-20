const express = require('express')
const router = express.Router()
const wordModel = require('../models/wordModel.js')

router.get('/getWord/:wordId', async (req, res)=>{
    const {wordId} = req.params
    const wordData = await wordModel.findById(wordId).exec()
    res.send(wordData)
})

module.exports = router