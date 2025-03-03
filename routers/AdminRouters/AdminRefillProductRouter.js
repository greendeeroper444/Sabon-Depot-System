const express = require('express');
const { addRefillProductAdmin, getRefillProductAdmin, getEditRefillProductAdmin, editRefillProductAdmin, deleteRefillProductAdmin, getRefillProductsAdmin, getUniqueCategoriesRefillProductAdmin } = require('../../controllers/AdminControllers/AdminRefillProductController');

const router = express.Router();


router.post('/addRefillProductAdmin', addRefillProductAdmin);
router.get('/getRefillProductAdmin', getRefillProductAdmin);
router.get('/getEditRefillProductAdmin/:productId', getEditRefillProductAdmin);
router.put('/editRefillProductAdmin/:productId', editRefillProductAdmin);
router.delete('/deleteRefillProductAdmin/:productId', deleteRefillProductAdmin);
router.get('/getRefillProductsAdmin', getRefillProductsAdmin);
router.get('/getUniqueCategoriesRefillProductAdmin', getUniqueCategoriesRefillProductAdmin);

module.exports = router;
