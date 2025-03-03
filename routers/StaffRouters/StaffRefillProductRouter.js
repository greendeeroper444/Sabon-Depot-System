const express = require('express');
const { addRefillProductStaff, getRefillProductStaff, getEditRefillProductStaff, editRefillProductStaff, deleteRefillProductStaff, getRefillProductsStaff, getUniqueCategoriesRefillProductStaff } = require('../../controllers/StaffControllers/StaffRefillProductController');

const router = express.Router();


router.post('/addRefillProductStaff', addRefillProductStaff);
router.get('/getRefillProductStaff', getRefillProductStaff);
router.get('/getEditRefillProductStaff/:productId', getEditRefillProductStaff);
router.put('/editRefillProductStaff/:productId', editRefillProductStaff);
router.delete('/deleteRefillProductStaff/:productId', deleteRefillProductStaff);
router.get('/getRefillProductsStaff', getRefillProductsStaff);
router.get('/getUniqueCategoriesRefillProductStaff', getUniqueCategoriesRefillProductStaff);

module.exports = router;
