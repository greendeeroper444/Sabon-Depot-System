const express = require('express');
const { addProductToCartRefillStaff, removeProductFromCartRefillStaff, getProductCartRefillStaff, updateProductQuantityRefillStaff, updateProductSizeUnitAndProductSizeStaff } = require('../../controllers/StaffControllers/StaffCartRefillController');

const router = express.Router();



router.post('/addProductToCartRefillStaff', addProductToCartRefillStaff);
router.get('/getProductCartRefillStaff/:staffId', getProductCartRefillStaff);
router.delete('/removeProductFromCartRefillStaff/:cartItemId', removeProductFromCartRefillStaff); 
router.put('/updateProductQuantityRefillStaff', updateProductQuantityRefillStaff);
// router.put('/updateProductSizeUnitAndProductSizeStaff', updateProductSizeUnitAndProductSizeStaff);
router.put('/updateCartItemSize', updateProductQuantityRefillStaff); 

module.exports = router;