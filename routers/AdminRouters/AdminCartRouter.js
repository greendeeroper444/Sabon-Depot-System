const express = require('express');
const { addProductToCartAdmin, getProductCartAdmin, removeProductFromCartAdmin, updateProductQuantityAdmin } = require('../../controllers/AdminControllers/AdminCartController');

const router = express.Router();

router.post('/addProductToCartAdmin', addProductToCartAdmin);
router.get('/getProductCartAdmin/:adminId', getProductCartAdmin);
router.delete('/removeProductFromCartAdmin/:cartItemId', removeProductFromCartAdmin); 
router.put('/updateProductQuantityAdmin', updateProductQuantityAdmin);
// router.put('/updateProductSizeUnitAndProductSizeAdmin', updateProductSizeUnitAndProductSizeAdmin);
router.put('/updateCartItemSize', updateProductQuantityAdmin); 

module.exports = router;