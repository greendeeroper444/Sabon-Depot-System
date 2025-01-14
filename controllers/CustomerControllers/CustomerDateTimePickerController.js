const DatePickerModel = require("../../models/DatePickerModel");
const TimePickerModel = require("../../models/TimePickerModel");



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
        //fetch all available times
        const availableTimes = await TimePickerModel.find({});
        
        res.status(200).json(availableTimes);
    } catch (error) {
        console.error('Error fetching available times:', error);
        res.status(500).json({ 
            message: 'Internal server error' 
        });
    }
};

module.exports = {
    getDateUnavailable,
    getTimeAvailable
}