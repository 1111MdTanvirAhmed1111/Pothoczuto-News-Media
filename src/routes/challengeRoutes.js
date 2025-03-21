
const router = require('express').Router();
const  authMiddleware  = require('@/middlewares/authMiddleware');

const {
  createChallenge,
  getChallenges,
  updateChallengeStatus,
  deleteChallenge,
} = require('@/controllers/challengeController');

// Create a new challenge for a post
router.post('/post/:id', authMiddleware, createChallenge);

// Get all challenges for a post
router.get('/post/:id', getChallenges);

// Update challenge status
router.patch('/:id', authMiddleware, updateChallengeStatus);

// Delete a challenge
router.delete('/:id', authMiddleware, deleteChallenge);

module.exports = router;