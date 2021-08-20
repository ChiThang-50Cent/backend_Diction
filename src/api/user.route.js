const express = require('express')
const router = express.Router()
const GroupModel = require('../models/groupModel.js')
const WordModel = require('../models/wordModel.js')

//router.post('/login')
//router.post('/signup')

router.get('/getUserGroup/:userId', async (req, res)=>{
    const {userId} = req.params
    let data = []
    try {
        data = await GroupModel.find({owner:userId})
    }catch(err){
        console.log(err.message)
    }
    res.send(data)
})

router.get('/search/:q', async (req, res)=>{
    const {q} = req.params
    try{
        const groups = await GroupModel.find({'name': {$regex : `^${q}`, $options  : 'i'}, 'shared' : true }).limit(5)
        const words = await WordModel.find({'word': {$regex : `^${q}`, $options  : 'i'}}).limit(10)
        res.send({
            groups,
            words
        })
    } catch (err) {
        console.log(err.message)
        res.send({})
    }
})

module.exports = router