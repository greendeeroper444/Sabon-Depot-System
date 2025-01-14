const express = require('express');
const { createDailyInventoryReportAdmin, getInventoryReportsAdmin, createDailySalesReportAdmin, getSalesReportsAdmin, updateInventoryReportNames, updateSalesReportNames } = require('../../controllers/AdminControllers/AdminReportController');

const router = express.Router();

//routes for inventory report
// router.post('/createDailyInventoryReportAdmin', createDailyInventoryReportAdmin);
router.get('/getInventoryReportsAdmin', getInventoryReportsAdmin);
router.put('/updateInventoryReportNames', updateInventoryReportNames);

// //routes for sales report
// router.post('/createDailySalesReportAdmin', createDailySalesReportAdmin);
router.get('/getSalesReportsAdmin', getSalesReportsAdmin);
router.put('/updateSalesReportNames', updateSalesReportNames);

module.exports = router;