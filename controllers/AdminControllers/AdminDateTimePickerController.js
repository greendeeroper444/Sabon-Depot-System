const DatePickerModel = require("../../models/DatePickerModel");
const TimePickerModel = require("../../models/TimePickerModel");

const convertToAmPm = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
};
  
const addDate = async(req, res) => {
    try {
        const {date} = req.body;

        //ensure `date` is a string or an array
        if(!date || (!Array.isArray(date) && typeof date !== 'string')){
            return res.status(400).json({ 
                message: 'Invalid date format. Expected a string or array.' 
            });
        }

        const dateString = Array.isArray(date) ? date.join(', ') : date;

        const newDate = new DatePickerModel({ 
            date: dateString 
        });
        await newDate.save();
        res.status(201).json({ 
            message: 'Date added successfully', newDate 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error adding date', error 
        });
    }
};

const addTime = async (req, res) => {
    try {
        const {time} = req.body;

       //ensure `time` is a string or an array 
        if(!time || (!Array.isArray(time) && typeof time !== 'string')){
            return res.status(400).json({message: 'Invalid time format. Expected a string or array.'});
        }

        //convert time to AM/PM format
        const timeString = Array.isArray(time)
            ? time.map(slot => {
                const [start, end] = slot.split(' - ');
                return `${convertToAmPm(start)} - ${convertToAmPm(end)}`;
            }).join(', ')
            : (() => {
                const [start, end] = time.split(' - ');
                return `${convertToAmPm(start)} - ${convertToAmPm(end)}`;
            })();

        const newTime = new TimePickerModel({ 
            time: timeString 
        });
        await newTime.save();
        res.status(201).json({ 
            message: 'Time added successfully', newTime 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error adding time', error 
        });
    }
};

const getDate = async(req, res) => {
    try {
        const data = await DatePickerModel.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching dates',
            error,
        });
    }
};

const getTime = async(req, res) => {
    try {
        const data = await TimePickerModel.find();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching times',
            error,
        });
    }
};


//DELETE Date
const deleteDate = async(req, res) => {
    try {
        const {id} = req.params;
        await DatePickerModel.findByIdAndDelete(id);
        res.status(200).json({ 
            message: 'Date deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error deleting date', error 
        });
    }
};

//UPDATE Date
const updateDate = async(req, res) => {
    try {
        const {id} = req.params;
        const {date} = req.body;
        await DatePickerModel.findByIdAndUpdate(id, {date});
        res.status(200).json({ 
            message: 'Date updated successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error updating date', error 
        });
    }
};

//DELETE Time
const deleteTime = async(req, res) => {
    try {
        const {id} = req.params;
        await TimePickerModel.findByIdAndDelete(id);
        res.status(200).json({ 
            message: 'Time deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error deleting time', error
        });
    }
};

//UPDATE Time
const updateTime = async(req, res) => {
    try {
        const {id} = req.params;
        const {time} = req.body;
        await TimePickerModel.findByIdAndUpdate(id, {time});
        res.status(200).json({ 
            message: 'Time updated successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error updating time', error 
        });
    }
};



const createTimeSlot = async(req, res) => {
    try {
        const {startTime, endTime} = req.body;

        if(!startTime || !endTime){
            return res.status(400).json({ 
                message: 'Start time and end time are required.' 
            });
        }

        const newTimeSlot = new TimePickerModel({
            time: {
                startTime,
                endTime
            }
        });

        await newTimeSlot.save();
        res.status(201).json({ 
            message: 'Time slot created successfully.', 
            newTimeSlot 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Server error' 
        });
    }
};

//update a time slot
const updateTimeSlot = async(req, res) => {
    try {
        const {startTime, endTime} = req.body;
        const {id} = req.params;

        if(!startTime || !endTime){
            return res.status(400).json({ 
                message: 'Both start time and end time are required.' 
            });
        }

        const updatedTimeSlot = await TimePickerModel.findByIdAndUpdate(
            id,
            {time: {startTime, endTime}},
            {new: true}
        );

        if(!updatedTimeSlot){
            return res.status(404).json({ 
                message: 'Time slot not found.' 
            });
        }

        res.status(200).json({ 
            message: 'Time slot updated successfully.', 
            updatedTimeSlot 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Server error' 
        });
    }
};

//fetch all time slots
const getAllTimeSlots = async(req, res) => {
    try {
        const timeSlots = await TimePickerModel.find();
        res.status(200).json(timeSlots);
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Server error' 
        });
    }
};
module.exports = {
    addDate,
    addTime,
    getDate,
    getTime,
    deleteDate,
    updateDate,
    deleteTime,
    updateTime,
    createTimeSlot,
    updateTimeSlot,
    getAllTimeSlots
};