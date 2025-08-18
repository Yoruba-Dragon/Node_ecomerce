const express= require('express')
const categoryController = require("../controllers/categories.controllers");
const router = express.Router();


router.get('/', categoryController.getAllCategories);
router.post('/', categoryController.createCategory);
router.get('/:id', categoryController.getCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;