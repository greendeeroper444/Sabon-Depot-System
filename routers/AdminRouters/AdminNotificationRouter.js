const express = require('express');
const { getNotificationsAdmin, getNotificationsOrderAdmin, updateNotificationStatus } = require('../../controllers/AdminControllers/AdminNotificationController');
const router = express.Router();

router.get('/getNotificationsAdmin', getNotificationsAdmin);
router.get('/getNotificationsOrderAdmin', getNotificationsOrderAdmin);
router.put('/updateNotificationStatus/:notificationId', updateNotificationStatus);


module.exports = router;
