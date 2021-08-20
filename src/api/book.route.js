const express = require('express');
const route = express.Router()
const BookModel = require('../models/bookModel.js')

route.post('/addbook', async (req, res) => {
    const data = req.body;
    try {
        const exist = await BookModel.findOne({name : data.name})
        if(!exist){
            await BookModel.create(data)
            res.send({ status: true })
        } else {
            await BookModel.findByIdAndUpdate(exist._id, {...data, lastUse : new Date()})
            res.send({
                status : true,
                mess : "Updated"
            })
        }
    } catch (err) {
        console.log(err.message)
        res.send({ status: false })
    }
})

route.get('/listbook/:userId/:limit', async (req, res)=>{
    const {userId, limit} = req.params
    try{
        const listBook = await BookModel.find({owner : userId}).sort({"lastUse":-1}).limit(Number(limit))
        res.send({status : true, listBook})
    } catch(err){
        console.log(err.message)
        res.send({status : false})
    } 
})

route.get('/exacbook/:bookId', async (req, res) => {
    const {bookId} = req.params
    try{
        await BookModel.findByIdAndUpdate(bookId, {lastUse : new Date()})
        res.send({status : true})
    } catch (err) {
        console.log(err.message)
        res.send({status : false})
    }
})

module.exports = route