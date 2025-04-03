const express = require('express');
const authMiddleware = require('@/middlewares/authMiddleware');
const roleMiddleware = require('@/middlewares/roleMiddleware');
const { createPost, GetPosts, deletePost, updatePost, blogSummerizerGemini, approvePost, disapprovePost } = require('@/controllers/blogController');
const { uploadSingle } = require('@/middlewares/multer');
const usersPostAuthenticate = require('@/middlewares/usersPostAuthenticate');

const router = express.Router();

// Full Non Restricted ROutes

router.get('/',GetPosts)
router.get('/summerize/:id', blogSummerizerGemini)

// Intermediate Routes
router.post('/' , authMiddleware, roleMiddleware('writer'), uploadSingle('PostImg'),createPost)
router.delete('/:id' ,authMiddleware ,roleMiddleware('writer'), usersPostAuthenticate, deletePost)
router.put('/:id'  ,authMiddleware,roleMiddleware('writer'), usersPostAuthenticate, uploadSingle('PostImg'), updatePost)


//Admin MasterClass Routes

router.delete('/admin/:id', authMiddleware, roleMiddleware('admin'), deletePost)
// router.put('/admin/:id', authMiddleware, roleMiddleware('admin'), uploadSingle('PostImg'), updatePost)

// Post Approval Routes
router.put('/admin/approve/:id', authMiddleware, roleMiddleware('admin'), approvePost)
router.put('/admin/disapprove/:id', authMiddleware, roleMiddleware('admin'), disapprovePost)

module.exports = router;