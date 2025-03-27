// commentController.js (Prisma version)
const { prisma } = require('@/config/dbConnect');



// Get all comments for a blog post
const getAllComments = async (req, res) => {
  try {
    const { blogId } = req.params;

    // Validate blogId
    if (!blogId || isNaN(parseInt(blogId))) {
      return res.status(400).json({ message: 'Invalid or missing post ID.' });
    }

    const comments = await prisma.comment.findMany({
      where: { postId: parseInt(blogId) },
      include: { replies: true },
    });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.', error: err.message });
  }
};

// Add a comment to a blog post
const addComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { text } = req.body;

    // Validate inputs
    if (!blogId || isNaN(parseInt(blogId))) {
      return res.status(400).json({ message: 'Invalid or missing post ID.' });
    }
    if (!text) {
      return res.status(400).json({ message: 'Text is required.' });
    }
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }

    const comment = await prisma.comment.create({
      data: {
        postId: parseInt(blogId),
        text,
        createdBy: req.user.id,
      },
    });
    res.status(201).json({ message: 'Comment added successfully.', comment });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.', error: err.message });
  }
};

// Reply to a comment
const replyToComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    // Validate inputs
    if (!commentId || isNaN(parseInt(commentId))) {
      return res.status(400).json({ message: 'Invalid or missing comment ID.' });
    }
    if (!text) {
      return res.status(400).json({ message: 'Text is required.' });
    }
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }

    // Check if comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId) },
    });
    if (!comment) return res.status(404).json({ message: 'Comment not found.' });

    // Create reply with createdBy
    const reply = await prisma.reply.create({
      data: {
        text,
        commentId: parseInt(commentId),
        createdBy: req.user.id, // Track reply ownership
      },
    });

    // Fetch updated comment
    const updatedComment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId) },
      include: { replies: true },
    });

    res.status(200).json({ message: 'Reply added successfully.', comment: updatedComment });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.', error: err.message });
  }
};

// Edit a reply to a comment
const editReply = async (req, res) => {
  try {
    const { commentId, replyId } = req.params;
    const { text } = req.body;

    // Validate inputs
    if (!commentId || isNaN(parseInt(commentId)) || !replyId || isNaN(parseInt(replyId))) {
      return res.status(400).json({ message: 'Invalid or missing IDs.' });
    }
    if (!text) {
      return res.status(400).json({ message: 'Text is required.' });
    }
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }

    // Check if comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId) },
      include: { replies: true },
    });
    if (!comment) return res.status(404).json({ message: 'Comment not found.' });

    // Check if reply exists
    const reply = await prisma.reply.findUnique({
      where: { id: parseInt(replyId) },
    });
    if (!reply) return res.status(404).json({ message: 'Reply not found.' });

    // Authorization check
    if (reply.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to edit this reply.' });
    }

    // Update reply
    const updatedReply = await prisma.reply.update({
      where: { id: parseInt(replyId) },
      data: { text },
    });

    // Fetch updated comment
    const updatedComment = await prisma.comment.findUnique({
      where: { id: parseInt(commentId) },
      include: { replies: true },
    });

    res.status(200).json({ message: 'Reply edited successfully.', comment: updatedComment });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.', error: err.message });
  }
};

// Edit a comment
const editComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    // Validate inputs
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ message: 'Invalid or missing comment ID.' });
    }
    if (!text) {
      return res.status(400).json({ message: 'Text is required.' });
    }
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }

    // Check if comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
    });
    if (!comment) return res.status(404).json({ message: 'Comment not found.' });

    // Authorization check
    if (comment.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to edit this comment.' });
    }

    // Update comment
    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: { text },
      include: { replies: true },
    });

    res.status(200).json({ message: 'Comment edited successfully.', comment: updatedComment });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.', error: err.message });
  }
};

// Approve a comment
const approveComment = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate inputs
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ message: 'Invalid or missing comment ID.' });
    }
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }

    // Check if comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
    });
    if (!comment) return res.status(404).json({ message: 'Comment not found.' });

    // Authorization check (assuming only admins can approve)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to approve comments.' });
    }

    // Update comment
    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: { approved: true },
      include: { replies: true },
    });

    // Log admin activity
    const { logAdminActivity, AdminActionTypes } = require('@/utils/adminActivityLogger');
    await logAdminActivity({
      adminId: req.user.id,
      actionType: AdminActionTypes.APPROVE_COMMENT,
      targetId: id,
      details: `Approved comment on post ${comment.postId}`,
      metadata: { postId: comment.postId }
    });

    res.status(200).json({ message: 'Comment approved.', comment: updatedComment });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.', error: err.message });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate inputs
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ message: 'Invalid or missing comment ID.' });
    }
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }

    // Check if comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(id) },
    });
    if (!comment) return res.status(404).json({ message: 'Comment not found.' });

    // Authorization check (assuming only owner or admin can delete)
    if (comment.createdBy !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to delete this comment.' });
    }

    // Delete comment
    await prisma.comment.delete({
      where: { id: parseInt(id) },
    });

    // Log admin activity if deleted by admin
    if (req.user.role === 'admin') {
      const { logAdminActivity, AdminActionTypes } = require('@/utils/adminActivityLogger');
      await logAdminActivity({
        adminId: req.user.id,
        actionType: AdminActionTypes.DELETE_COMMENT,
        targetId: id,
        details: `Deleted comment from post ${comment.postId}`,
        metadata: { postId: comment.postId }
      });
    }

    res.status(200).json({ message: 'Comment deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.', error: err.message });
  }
};

module.exports = {
  editReply,
  addComment,
  replyToComment,
  approveComment,
  deleteComment,
  editComment,
  getAllComments,
};