const express = require('express');
const {
  addComment,
  replyToComment,
  approveComment,
  deleteComment,
  editComment,
} = require('@/controllers/commentController');
const authMiddleware = require('@/middlewares/authMiddleware');
const roleMiddleware = require('@/middlewares/roleMiddleware');
const usersCommentAuthenticate = require('@/middlewares/usersCommentAuth');
const { getAllComments } = require('@/controllers/commentController');
const router = express.Router();



 
  //Normals Zone
// Get all comments for a blog post
router.get('/:blogId', getAllComments);

// Add a comment to a blog post
router.post('/:blogId', authMiddleware, addComment);

// Reply to a comment
router.post('/reply/:commentId', authMiddleware, replyToComment);

 
// Edit Comment For User
router.put('/:id', authMiddleware,usersCommentAuthenticate, editComment)

// Delete Comment for a User
router.delete('/:id', authMiddleware, usersCommentAuthenticate, deleteComment)




// Admins Zone


// Approve a comment 
router.put('/:id/approve', authMiddleware, roleMiddleware('admin'), approveComment);
// Delete a comment
router.delete('/admin/:id', authMiddleware, roleMiddleware('admin'), deleteComment);




module.exports = router;
