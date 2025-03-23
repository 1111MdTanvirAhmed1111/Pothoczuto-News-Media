const express = require('express');
const { register, login, getUserData , getAllUsers } = require('@/controllers/authController');
const roleMiddleware = require('@/middlewares/roleMiddleware');
const authMiddleware = require('@/middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/userdata', authMiddleware , getUserData);
router.get('/getAllUsers', authMiddleware , roleMiddleware('admin') , getAllUsers);
module.exports = router;