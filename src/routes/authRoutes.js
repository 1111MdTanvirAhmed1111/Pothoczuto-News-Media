const express = require('express');
const { register, login, getUserData , getAllUsers } = require('@/controllers/authController');
const roleMiddleware = require('@/middlewares/roleMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/userdata', getUserData);
router.get('/getAllUsers',roleMiddleware('admin') , getAllUsers);
module.exports = router;