const express = require('express');
const { addProductToCartRefillAdmin, removeProductFromCartRefillAdmin, getProductCartRefillAdmin, updateProductVolumeRefillAdmin, updateProductSizeUnitAndProductSizeAdmin, updateProductPriceRefillAdmin } = require('../../controllers/AdminControllers/AdminCartRefillController');

const router = express.Router();



router.post('/addProductToCartRefillAdmin', addProductToCartRefillAdmin);
router.get('/getProductCartRefillAdmin/:adminId', getProductCartRefillAdmin);
router.delete('/removeProductFromCartRefillAdmin/:cartItemId', removeProductFromCartRefillAdmin); 
router.put('/updateProductVolumeRefillAdmin', updateProductVolumeRefillAdmin);
// router.put('/updateProductSizeUnitAndProductSizeAdmin', updateProductSizeUnitAndProductSizeAdmin);
router.put('/updateCartItemSize', updateProductVolumeRefillAdmin); 
router.put('/updateProductPriceRefillAdmin', updateProductPriceRefillAdmin);

module.exports = router;