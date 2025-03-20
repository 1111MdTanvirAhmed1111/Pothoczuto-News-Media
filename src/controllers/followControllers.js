const {prisma} = require('@/config/dbConnect');

// Follow a user
const followUser = async (req, res) => {
  try {
    const { followerId, followingId } = req.body;

    // Check if the follower is already following the user
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (existingFollow) {
      return res.status(400).json({ message: "You are already following this user." });
    }

    // Create a new follow
    const follow = await prisma.follow.create({
      data: {
        followerId,
        followingId,
      },
    });

    return res.status(201).json({ message: "Followed successfully.", follow });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Unfollow a user
const unfollowUser = async (req, res) => {
  try {
    const { followerId, followingId } = req.body;

    // Check if the follow relationship exists
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (!follow) {
      return res.status(400).json({ message: "You are not following this user." });
    }

    // Delete the follow relationship
    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    return res.status(200).json({ message: "Unfollowed successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Get all followers of a user
const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;

    const followers = await prisma.follow.findMany({
      where: {
        followingId: parseInt(userId),
      },
      include: {
        follower: true, // Include follower's details
      },
    });

    return res.status(200).json({ followers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Get all following users of a user
const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;

    const following = await prisma.follow.findMany({
      where: {
        followerId: parseInt(userId),
      },
      include: {
        following: true, // Include followed user's details
      },
    });

    return res.status(200).json({ following });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
};
