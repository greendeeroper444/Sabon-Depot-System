const express = require('express');
const { addProductCategory, getProductCategory, updateProductCategory, deleteProductCategory } = require("../../controllers/AdminControllers/AdminProductCategoryController");

const router = express.Router();

router.post('/addProductCategory', addProductCategory);
router.get('/getProductCategory', getProductCategory);
router.put('/updateProductCategory/:id', updateProductCategory);
router.delete('/deleteProductCategory/:id', deleteProductCategory);

module.exports = router;