const express = require('express');
const router = express.Router();
const { forgotPassword, verifyOTP, resetPassword } = require('@/controllers/authController');

// Route for initiating password reset and sending OTP
router.post('/forgot-password', forgotPassword);

// Route for verifying OTP
router.post('/verify-otp', verifyOTP);
 
// Route for resetting password after OTP verification
router.post('/reset-password', resetPassword);

module.exports = router;