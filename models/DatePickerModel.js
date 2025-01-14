const mongoose = require('mongoose');


const DatePickerSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
});


const DatePickerModel = mongoose.model('DatePicker', DatePickerSchema);
module.exports = DatePickerModel;
