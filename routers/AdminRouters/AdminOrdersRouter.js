const express = require('express');
const { getAllOrdersAdmin, getOrderDetailsAdmin, approveOrderAdmin, updateOrderStatusAdmin, getCompleteOrderTransactionAdmin, declineOrderAdmin, updateOrderReceiptAdmin } = require('../../controllers/AdminControllers/AdminOrdersController');

const router = express.Router();


router.get('/getAllOrdersAdmin', getAllOrdersAdmin);
router.get('/getOrderDetailsAdmin/:orderId', getOrderDetailsAdmin);
router.put('/approveOrderAdmin/:orderId', approveOrderAdmin);
router.put('/updateOrderStatusAdmin/:orderId', updateOrderStatusAdmin); 
router.get('/getCompleteOrderTransactionAdmin', getCompleteOrderTransactionAdmin);
router.put('/declineOrderAdmin/:orderId', declineOrderAdmin);
router.put('/updateOrderReceiptAdmin/:orderId', updateOrderReceiptAdmin)

module.exports = router;