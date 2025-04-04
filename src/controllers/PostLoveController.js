const { prisma } = require('@/config/dbConnect');

// Add love reaction to a post
const addLoveReaction = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    // Check if the post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Check if user has already loved this post
    const existingLove = await prisma.postLove.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLove) {
      return res.status(400).json({ message: "You have already loved this post." });
    }

    // Create new love reaction
    const loveReaction = await prisma.postLove.create({
      data: {
        userId,
        postId,
      },
    });

    return res.status(201).json({ message: "Love reaction added successfully.", loveReaction });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Remove love reaction from a post
const removeLoveReaction = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.body.user.id;

    // Check if the love reaction exists
    const existingLove = await prisma.postLove.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (!existingLove) {
      return res.status(404).json({ message: "Love reaction not found." });
    }

    // Remove the love reaction
    await prisma.postLove.delete({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    return res.status(200).json({ message: "Love reaction removed successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Get love reactions count for a post
const getPostLoveCount = async (req, res) => {
  try {
    const { postId } = req.params;

    const loveCount = await prisma.postLove.count({
      where: { postId },
    });

    return res.status(200).json({ postId, loveCount });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  addLoveReaction,
  removeLoveReaction,
  getPostLoveCount,
};