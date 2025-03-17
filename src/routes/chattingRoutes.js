const { sendMessage, getChatting, chatList, } = require('@/controllers/ChattingControllers')

const router = require('express').Router()

router.post('sendMessege', sendMessage)
router.get('/',getChatting)
router.get('/',chatList)


module.exports = router