const DatePickerModel = require("../../models/DatePickerModel");
const TimePickerModel = require("../../models/TimePickerModel");
const moment = require('moment');


const getDateUnavailable = async(req, res) => {
    try {
        //fetch unavailable dates
        const unavailableRecords = await DatePickerModel.find({});
        
        //create an array of unavailable dates
        const unavailableDates = unavailableRecords.map((record) => record.date);

        res.status(200).json({ 
            unavailable: unavailableDates 
        });
    } catch (error) {
        console.error('Error fetching unavailable data:', error);
        res.status(500).json({ 
            message: 'Internal server error' 
        });
    }
};

const getTimeAvailable = async(req, res) => {
    try {

        const availableTimes = await TimePickerModel.find({});

        //format time slots as '4:00pm - 5:00pm'
        const formattedTimes = availableTimes.map(timeSlot => ({
            _id: timeSlot._id,
            formattedTime: timeSlot.time 
                ? `${moment(timeSlot.time.startTime, 'HH:mm').format('h:mm A')} - ${moment(timeSlot.time.endTime, 'HH:mm').format('h:mm A')}`
                : 'Unavailable'
        }));

        res.status(200).json(formattedTimes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Internal server error' 
        });
    }
};

module.exports = {
    getDateUnavailable,
    getTimeAvailable
}