const exppress = require('express');
const { addProductSize, getProductSize, updateProductSize, deleteProductSize, getSizeUnitsWithSizes } = require("../../controllers/AdminControllers/AdminProductSizeController");

const router = exppress.Router();

router.post('/addProductSize', addProductSize);
router.get('/getProductSize', getProductSize);
router.put('/updateProductSize/:id', updateProductSize);
router.delete('/deleteProductSize/:id', deleteProductSize);
router.get('/getSizeUnitsWithSizes', getSizeUnitsWithSizes);

module.exports = router;