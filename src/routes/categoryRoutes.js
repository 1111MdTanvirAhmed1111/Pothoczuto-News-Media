const router  = require('express').Router();
const { createCategory, deleteCategory } = require('@/controllers/CategoryControllers');
const authMiddleware = require('@/middlewares/authMiddleware');
const roleMiddleware = require('@/middlewares/roleMiddleware');


router.get('/catergory')
router.post('/catergory/:id',authMiddleware ,roleMiddleware('admin'), createCategory)
router.delete('/catergory/:id', authMiddleware ,roleMiddleware('admin'), deleteCategory)

module.exports = router;