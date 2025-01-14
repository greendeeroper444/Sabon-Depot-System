const mongoose = require('mongoose');


const TimePickerSchema = new mongoose.Schema({
    time: {
        type: String,
        required: true,
    },
});


const TimePickerModel = mongoose.model('TimePicker', TimePickerSchema);
module.exports = TimePickerModel;
