const express = require('express');
const { addDate, getDate, addTime, getTime, deleteDate, updateDate, deleteTime, updateTime } = require('../../controllers/AdminControllers/AdminDateTimePickerController');

const router = express.Router();

router.post('/addDate', addDate);
router.get('/getDate', getDate);
router.delete('/deleteDate/:id', deleteDate);
router.put('/updateDate/:id', updateDate);

router.post('/addTime', addTime);
router.get('/getTime', getTime);
router.delete('/deleteTime/:id', deleteTime);
router.put('/updateTime/:id', updateTime);

module.exports = router;