const express = require('express');
const { loginAdmin, logoutAdmin, getDataAdmin, updateProfileAdmin, getDataUpdateAdmin } = require('../../controllers/AdminControllers/AdminAuthController');
const router = express.Router();


router.post('/loginAdmin', loginAdmin);
router.post('/logoutAdmin', logoutAdmin);
router.get('/getDataAdmin', getDataAdmin);

//add more information admin
router.post('/updateProfileAdmin/:adminId', updateProfileAdmin);
router.get('/getDataUpdateAdmin/:adminId', getDataUpdateAdmin);

module.exports = router;