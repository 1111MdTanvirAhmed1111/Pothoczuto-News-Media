const Comment = require('@/models/Comment');

// Get all comments for a blog post
const getAllComments = async (req, res) => {
  try {
    const { blogId } = req.params;
    const comments = await Comment.find({ blogId });
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
    const comment = await Comment.create({
      blogId,
      text,
      createdBy: req.user._id,
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
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found.' });

    comment.replies.push({ text, createdBy: req.user._id });
    await comment.save();
    res.status(200).json({ message: 'Reply added successfully.', comment });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.', error: err.message });
  }
};



// Edit a reply to a comment
const editReply = async (req, res) => {
  try {
    const { commentId, replyId } = req.params;
    const { text } = req.body;
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found.' });

    const reply = comment.replies.id(replyId);
    if (!reply) return res.status(404).json({ message: 'Reply not found.' });

    // Ensure the user editing the reply is the one who created it
    if (reply.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to edit this reply.' });
    }

    reply.text = text;
    await comment.save();
    res.status(200).json({ message: 'Reply edited successfully.', comment });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.', error: err.message });
  }
};


// Edit a comment
const editComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: 'Comment not found.' });

    if (comment.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to edit this comment.' });
    }

    comment.text = text;
    await comment.save();
    res.status(200).json({ message: 'Comment edited successfully.', comment });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.', error: err.message });
  }
};




// Approve a comment
const approveComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByIdAndUpdate(
      id,
      { approved: true },
      { new: true }
    );
    if (!comment) return res.status(404).json({ message: 'Comment not found.' });
    res.status(200).json({ message: 'Comment approved.', comment });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error.', error: err.message });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) return res.status(404).json({ message: 'Comment not found.' });
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
  getAllComments
};

