const router  = require('express').Router();
const { createCategory, deleteCategory, getAllCategories } = require('@/controllers/CategoryControllers');
const authMiddleware = require('@/middlewares/authMiddleware');
const roleMiddleware = require('@/middlewares/roleMiddleware');


router.get('/',getAllCategories)
router.post('/:id',authMiddleware ,roleMiddleware('admin'), createCategory)
router.delete('/:id', authMiddleware ,roleMiddleware('admin'), deleteCategory)

module.exports = router;