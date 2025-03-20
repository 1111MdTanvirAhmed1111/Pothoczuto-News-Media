// usersCommentAuthenticate.js (Prisma version)
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const usersCommentAuthenticate = async (req, res, next) => {
  try {
  

    // Find comment by ID
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(req.params.commentId) }, // Convert to Int
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if user owns the comment
    if (comment.createdBy !== req.user.id) {
      return res.status(403).json({ error: 'User not authorized to access this comment' });
    }

    // Set req.user and req.comment

    req.comment = comment;

    next();
  } catch (error) {
    console.error('Comment authentication error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Please authenticate. Invalid token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Please authenticate. Token expired.' });
    }
    res.status(401).json({ error: 'Please authenticate' });
  }
};

module.exports = usersCommentAuthenticate;