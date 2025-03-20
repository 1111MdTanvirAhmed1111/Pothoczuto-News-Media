const {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
  } = require('@/controllers/followControllers');

const router  = require('express').Router();

// Follow a user
router.post('/follow',  followUser);

// Unfollow a user
router.post('/unfollow',  unfollowUser);

// Get all followers of a user
router.get('/followers/:userId',  getFollowers);

// Get all following users of a user
router.get('following/:userId/',  getFollowing);

module.exports = router;