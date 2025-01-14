const express = require('express');
const { getDateUnavailable, getTimeAvailable } = require('../../controllers/CustomerControllers/CustomerDateTimePickerController');

const router = express.Router();

router.get('/getDateUnavailable', getDateUnavailable);
router.get('/getTimeAvailable', getTimeAvailable)

module.exports = router;