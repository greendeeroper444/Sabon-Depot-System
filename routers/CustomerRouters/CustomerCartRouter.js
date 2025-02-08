const express = require('express');
const { addProductToCartCustomer, getProductCartCustomer, removeProductFromCartCustomer, updateProductQuantity, updateProductQuantityCustomer } = require('../../controllers/CustomerControllers/CustomerCartController');


const router = express.Router();



router.post('/addProductToCartCustomer', addProductToCartCustomer);
router.get('/getProductCartCustomer/:customerId', getProductCartCustomer);
router.delete('/removeProductFromCartCustomer/:cartItemId', removeProductFromCartCustomer); 
router.put('/updateProductQuantity/:cartItemId', updateProductQuantity);
router.put('/updateProductQuantityCustomer', updateProductQuantityCustomer);

module.exports = router;