const express = require('express')
const router = express.Router()
const GroupModel = require('../models/groupModel.js')
const WordModel = require('../models/wordModel.js')

router.get('/getGroupWord/:groupId', async (req, res) => {
    const { groupId } = req.params
    try {
        const listWord = await GroupModel.findById(groupId, 'word owner shared name').exec()
        const data = []
        for (const el of listWord.word) {
            const result = await WordModel.findById(el).exec()
            data.push(result)
        }
        res.send({
            status : true,
            words : data,
            owner : listWord.owner,
            shared : listWord.shared,
            name : listWord.name
        })
    } catch (err){
        console.log(err.message)
        res.send({status : false})
    }
   
})

router.get('/add/:groupId/:wordId', async (req, res) => {
    const { groupId, wordId } = req.params
    const group = await GroupModel.findById(groupId)
    if (!group.word.includes(wordId)) {
        group.word.push(wordId)
        await group.save()
        res.send({
            status: true
        })
    } else {
        res.send({
            status: false
        })
    }

})

router.get('/remove/:groupId/:wordId', async (req, res)=>{
    const {groupId, wordId} = req.params
    try {
        await GroupModel.findOneAndUpdate({"_id" :groupId }, {$pull : {word : wordId}})
    } catch(err){
        console.log(err.message)
        res.send({status:false})
    }
    res.send({
        status : true
    })
})

router.get('/create/:name/:userId', async (req, res)=>{
    const {name, userId} = req.params
    try {
        const group = await GroupModel.create({name : name, owner: userId})
        res.send({
            status : true,
            group
        })
    } catch (err){
        console.log(err.message)
        res.send({status : false})
    }

})

module.exports = router