const prisma = require('../prisma/client');

// Upvote a post
const upvotePost = async (req, res) => {
  try {
    const {  postId } = req.body;
const {id} = req.body.user.id
    // Check if the user has already voted on this post
    const existingVote = await prisma.vote.findUnique({
      where: {
        postId: {
          id,
          postId,
        },
      },
    });

    if (existingVote) {
      return res.status(400).json({ message: "You have already voted on this post." });
    }

    // Create a new upvote
    const vote = await prisma.vote.create({
      data: {
        id,
        postId,
        voteType: 'upvote', // Mark as upvote
      },
    });

    return res.status(201).json({ message: "Upvoted successfully.", vote });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Downvote a post
const downvotePost = async (req, res) => {
  try {
    const { id, postId } = req.body;

    // Check if the user has already voted on this post
    const existingVote = await prisma.vote.findUnique({
      where: {
        postId: {
          id,
          postId,
        },
      },
    });

    if (existingVote) {
      return res.status(400).json({ message: "You have already voted on this post." });
    }

    // Create a new downvote
    const vote = await prisma.vote.create({
      data: {
        id,
        postId,
        voteType: 'downvote', // Mark as downvote
      },
    });

    return res.status(201).json({ message: "Downvoted successfully.", vote });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Get votes for a post
const getPostVotes = async (req, res) => {
  try {
    const { postId } = req.params;

    // Get all votes for the post
    const votes = await prisma.vote.findMany({
      where: {
        postId: parseInt(postId),
      },
    });

    // Calculate the total upvotes and downvotes
    const upvotes = votes.filter(vote => vote.voteType === 'upvote').length;
    const downvotes = votes.filter(vote => vote.voteType === 'downvote').length;

    return res.status(200).json({ postId, upvotes, downvotes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  upvotePost,
  downvotePost,
  getPostVotes,
};
