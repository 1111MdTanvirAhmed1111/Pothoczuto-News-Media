const {
    upvotePost,
    downvotePost,
    getPostVotes,
  } = require('@/controllers/VoteControllers');

const router  = require('express').Router();
upvotePost
// Upvote a post
router.post('/upvote',  upvotePost);

// Downvote a post
router.post('/downvote',  downvotePost);

// Get all votes for a post
router.get('votes/:postId/',  getPostVotes);


module.exports = router;