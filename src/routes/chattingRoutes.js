const {  getChatting, chatList, } = require('@/controllers/ChattingControllers')

const router = require('express').Router()

router.get('/',getChatting)
router.get('/',chatList)


module.exports = router