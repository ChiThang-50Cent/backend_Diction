const express = require('express');
const newWordsAPI = require('../api/newWord.route.js')
const userAPI = require('../api/user.route.js')
const GroupAPI = require('../api/group.route.js')
const BookAPI = require('../api/book.route.js')
const router = express.Router();

router.use('/', newWordsAPI)
router.use('/', userAPI )
router.use('/', GroupAPI)
router.use('/', BookAPI)

module.exports = router