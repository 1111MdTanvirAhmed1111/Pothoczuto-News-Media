const express = require('express');
const { register, login, getUserData } = require('@/controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/userdata', getUserData);

module.exports = router;