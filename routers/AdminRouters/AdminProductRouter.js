const express = require('express');
const { uploadProductAdmin, getProductAdmin, deleteProductAdmin, editProductAdmin, getEditProductAdmin, getProductSummaryAdmin, getOutOfStockProductsAdmin, getProductsAdmin, getUniqueCategoriesAdmin, getBatchProductAdmin } = require('../../controllers/AdminControllers/AdminProductController');
const router = express.Router();


router.post('/uploadProductAdmin', uploadProductAdmin);
router.get('/getProductAdmin', getProductAdmin);
router.delete('/deleteProductAdmin/:productId', deleteProductAdmin);
router.put('/editProductAdmin/:productId', editProductAdmin);
router.get('/getEditProductAdmin/:productId', getEditProductAdmin);
router.get('/getProductSummaryAdmin', getProductSummaryAdmin);

router.get('/getOutOfStockProductsAdmin', getOutOfStockProductsAdmin);

router.get('/getProductsAdmin', getProductsAdmin);
router.get('/getUniqueCategoriesAdmin', getUniqueCategoriesAdmin);

router.get('/getBatchProductAdmin', getBatchProductAdmin);

module.exports = router;
