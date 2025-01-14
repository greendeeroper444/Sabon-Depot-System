const mongoose = require('mongoose');

const AdminInventoryReportSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    sizeUnit: {
        type: String,
        required: true
    },
    productSize: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    preparedBy: {
        type: String,
        default: ''
    },
    checkedBy: {
        type: String,
        default: ''
    },
    receivedBy: {
        type: String,
        default: ''
    },
    reportDate: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const AdminInventoryReportModel = mongoose.model('InventoryReport', AdminInventoryReportSchema);
module.exports = AdminInventoryReportModel;