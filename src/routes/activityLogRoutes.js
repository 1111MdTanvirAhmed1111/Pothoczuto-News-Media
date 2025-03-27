
const router = require('express').Router();
const { getActivityLogs } = require('@/controllers/activityLogController');
const authMiddleware = require('@/middlewares/authMiddleware');

const roleMiddleware = require('@/middlewares/roleMiddleware');

// Route to get activity logs with pagination (admin only)
router.get('/', authMiddleware ,roleMiddleware('admin') ,getActivityLogs);

module.exports = router;