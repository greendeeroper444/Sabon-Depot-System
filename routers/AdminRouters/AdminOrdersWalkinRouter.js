const express = require('express');
const { addOrderWalkinAdmin, getOrderWalkinAdmin, getAllOrderWalkinAdmin, updateOrderWalkinAdmin, getUpdateOrderWalkinAdmin } = require('../../controllers/AdminControllers/AdminOrdersWalkinController');
const router = express.Router();

router.post('/addOrderWalkinAdmin', addOrderWalkinAdmin);
router.get('/getOrderWalkinAdmin/:orderId?', getOrderWalkinAdmin);
router.get('/getAllOrderWalkinAdmin', getAllOrderWalkinAdmin);
router.put('/updateOrderWalkinAdmin/:orderId', updateOrderWalkinAdmin);
router.get('/getUpdateOrderWalkinAdmin/:orderId', getUpdateOrderWalkinAdmin);

module.exports = router;