const express = require('express');
const { addProductToCartRefillStaff, removeProductFromCartRefillStaff, getProductCartRefillStaff, updateProductVolumeRefillStaff, updateProductSizeUnitAndProductSizeStaff, updateProductPriceRefillStaff } = require('../../controllers/StaffControllers/StaffCartRefillController');

const router = express.Router();



router.post('/addProductToCartRefillStaff', addProductToCartRefillStaff);
router.get('/getProductCartRefillStaff/:staffId', getProductCartRefillStaff);
router.delete('/removeProductFromCartRefillStaff/:cartItemId', removeProductFromCartRefillStaff); 
router.put('/updateProductVolumeRefillStaff', updateProductVolumeRefillStaff);
// router.put('/updateProductSizeUnitAndProductSizeStaff', updateProductSizeUnitAndProductSizeStaff);
router.put('/updateCartItemSize', updateProductVolumeRefillStaff); 
router.put('/updateProductPriceRefillStaff', updateProductPriceRefillStaff);

module.exports = router;