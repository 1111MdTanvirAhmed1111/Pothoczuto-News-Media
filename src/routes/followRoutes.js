const {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
  } = require('@/controllers/followControllers');
const authMiddleware  = require('@/middlewares/authMiddleware');

const router = require('express').Router();

// Follow a user
router.post('/follow/:followingId', authMiddleware, followUser);

// Unfollow a user
router.post('/unfollow', authMiddleware, unfollowUser);

// Get all followers of a user
router.get('/followers/:userId', getFollowers);

// Get all following users of a user
router.get('/following/:userId', getFollowing);

module.exports = router;