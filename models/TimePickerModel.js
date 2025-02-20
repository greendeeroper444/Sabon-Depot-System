const mongoose = require('mongoose');


const TimePickerSchema = new mongoose.Schema({
    time: {
        startTime: {
            type: String,
            required: true
        },
        endTime: {
            type: String,
            require: true
        }
    },
});


const TimePickerModel = mongoose.model('TimePicker', TimePickerSchema);
module.exports = TimePickerModel;
