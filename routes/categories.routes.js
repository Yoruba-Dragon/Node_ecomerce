const express= require('express')
const categoryController = require("../controllers/categories.controllers");
const {  protect, restrictTo } = require("../middleware/auth.middleware");
const router = express.Router();


router.get('/', categoryController.getAllCategories);
router.post('/', protect, restrictTo('admin'), categoryController.createCategory);
router.get('/:id', categoryController.getCategory);
router.put('/:id', protect, restrictTo('admin'), categoryController.updateCategory);
router.delete('/:id', protect, restrictTo('admin'), categoryController.deleteCategory);

module.exports = router;