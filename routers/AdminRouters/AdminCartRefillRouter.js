const express = require('express');
const { addProductToCartRefillAdmin, removeProductFromCartRefillAdmin, getProductCartRefillAdmin, updateProductQuantityRefillAdmin, updateProductSizeUnitAndProductSizeAdmin } = require('../../controllers/AdminControllers/AdminCartRefillController');

const router = express.Router();



router.post('/addProductToCartRefillAdmin', addProductToCartRefillAdmin);
router.get('/getProductCartRefillAdmin/:adminId', getProductCartRefillAdmin);
router.delete('/removeProductFromCartRefillAdmin/:cartItemId', removeProductFromCartRefillAdmin); 
router.put('/updateProductQuantityRefillAdmin', updateProductQuantityRefillAdmin);
// router.put('/updateProductSizeUnitAndProductSizeAdmin', updateProductSizeUnitAndProductSizeAdmin);
router.put('/updateCartItemSize', updateProductQuantityRefillAdmin); 

module.exports = router;