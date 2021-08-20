const express = require('express');
const cors = require('cors');
const mongooes = require('mongoose');
const Routers = require('./routers/routers.js')
const bodyParser = require('body-parser')
const app = express();

app.use(cors());
app.use(bodyParser.json());

mongooes
    .connect('mongodb+srv://ChiThang:@@~~~123lol@cluster0.exh3d.mongodb.net/Vocabulary?retryWrites=true&w=majority',
    {
        useNewUrlParser : true,
        useUnifiedTopology : true,
        useFindAndModify: false
    })
    .catch(err => {
        console.log(err.message)
    })
    .then(() => {
        console.log("Mongodb connected")
    })

app.use('/', Routers);

app.listen(5000, ()=>{
    console.log("Listen on port: ", 5000);
})