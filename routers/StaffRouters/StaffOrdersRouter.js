const express = require('express');
const { getAllOrdersStaff, getOrderDetailsStaff, approveOrderStaff, updateOrderStatusStaff, getCompleteOrderTransactionStaff, createOrderStaff, getPosOrdersStaff, declineOrderStaff, updateOrderReceiptStaff } = require('../../controllers/StaffControllers/StaffOrdersController');

const router = express.Router();


router.get('/getAllOrdersStaff', getAllOrdersStaff);
router.get('/getOrderDetailsStaff/:orderId', getOrderDetailsStaff);
router.put('/approveOrderStaff/:orderId', approveOrderStaff);
router.put('/updateOrderStatusStaff/:orderId', updateOrderStatusStaff); 
router.get('/getCompleteOrderTransactionStaff', getCompleteOrderTransactionStaff);
router.put('/declineOrderStaff/:orderId', declineOrderStaff);
router.put('/updateOrderReceiptStaff/:orderId', updateOrderReceiptStaff)



module.exports = router;