const express = require('express');
const router = express.Router();
const { getUserNotifications, getNotificationSummary } = require('@/controllers/NotificationController');
const authMiddleware = require('@/middlewares/authMiddleware');

// Get user notifications with pagination
router.get('/', authMiddleware, getUserNotifications);

// Get summary of unread notifications
router.get('/summary', authMiddleware, getNotificationSummary);

module.exports = router;