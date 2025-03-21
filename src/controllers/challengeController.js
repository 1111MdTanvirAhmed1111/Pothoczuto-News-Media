const { prisma } = require('@/config/dbConnect');

// Create a new challenge for a post
const createChallenge = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({ message: 'Challenge content is required.' });
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Create the challenge
    const challenge = await prisma.challenge.create({
      data: {
        postId,
        userId,
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            profilePic: true,
          },
        },
        post: true,
      },
    });

    res.status(201).json({
      message: 'Challenge created successfully.',
      challenge,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

// Get all challenges for a post
const getChallenges = async (req, res) => {
  try {
    const { id: postId } = req.params;

    const challenges = await prisma.challenge.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            profilePic: true,
          },
        },
        post: true,
      },
    });

    res.status(200).json(challenges);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

// Update challenge status
const updateChallengeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const challenge = await prisma.challenge.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            profilePic: true,
          },
        },
        post: true,
      },
    });

    res.status(200).json({
      message: 'Challenge status updated successfully.',
      challenge,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Challenge not found.' });
    }
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

// Delete a challenge
const deleteChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if challenge exists and belongs to the user
    const challenge = await prisma.challenge.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found or unauthorized.' });
    }

    await prisma.challenge.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Challenge deleted successfully.' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Challenge not found.' });
    }
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

module.exports = {
  createChallenge,
  getChallenges,
  updateChallengeStatus,
  deleteChallenge,
};