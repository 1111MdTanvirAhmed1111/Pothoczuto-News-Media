const express = require('express');
const router = express.Router();

const {
  addLoveReaction,
  removeLoveReaction,
  getPostLoveCount,
} = require('@/controllers/PostLoveController');
const authMiddleware = require('@/middlewares/authMiddleware');

// Add love reaction to a post
router.post('/:postId', authMiddleware, addLoveReaction);

// Remove love reaction from a post
router.delete('/:postId', authMiddleware, removeLoveReaction);

// Get love reactions count for a post
router.get('/:postId/count', getPostLoveCount);

module.exports = router;