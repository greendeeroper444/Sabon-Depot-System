const express = require('express');
const { addOrderRefillAdmin, getOrderRefillAdmin, getAllOrderRefillAdmin, updateOrderRefillAdmin, getUpdateOrderRefillAdmin } = require('../../controllers/AdminControllers/AdminOrdersRefillController');
const router = express.Router();

router.post('/addOrderRefillAdmin', addOrderRefillAdmin);
router.get('/getOrderRefillAdmin/:orderId?', getOrderRefillAdmin);
router.get('/getAllOrderRefillAdmin', getAllOrderRefillAdmin);
router.put('/updateOrderRefillAdmin/:orderId', updateOrderRefillAdmin);
router.get('/getUpdateOrderRefillAdmin/:orderId', getUpdateOrderRefillAdmin);

module.exports = router;