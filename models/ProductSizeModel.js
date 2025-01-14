const mongoose = require('mongoose');


const ProductSizeSchema = new mongoose.Schema({
    sizeUnit: {
        type: String,
        required: true,
    },
    productSize: {
        type: String,
        required: true,
    },
}, timestamp = true);


const ProductSizeModel = mongoose.model('ProductSize', ProductSizeSchema);
module.exports = ProductSizeModel;
