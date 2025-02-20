const express = require('express');
const { addDate, getDate, addTime, getTime, deleteDate, updateDate, deleteTime, updateTime, createTimeSlot, updateTimeSlot, getAllTimeSlots } = require('../../controllers/AdminControllers/AdminDateTimePickerController');

const router = express.Router();

router.post('/addDate', addDate);
router.get('/getDate', getDate);
router.delete('/deleteDate/:id', deleteDate);
router.put('/updateDate/:id', updateDate);

router.post('/addTime', addTime);
router.get('/getTime', getTime);
router.delete('/deleteTime/:id', deleteTime);
router.put('/updateTime/:id', updateTime);


//newtime
router.post('/createTimeSlot', createTimeSlot);
router.put('/updateTimeSlot/:id', updateTimeSlot);
router.get('/getAllTimeSlots', getAllTimeSlots);

module.exports = router;