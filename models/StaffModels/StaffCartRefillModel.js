const mongoose = require('mongoose');


const StaffCartRefillSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    staffId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff'
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'RefillProduct',
    },
    productName: {type: String}, 
    volume: {
        type: Number,
    },
    price: { 
        type: Number 
    },
    sizeUnit: {
        type: String, //Mililiter, Liter, Gallon
        default: 'Liter'
    },
    productSize: {
        type: String, //like 200ml, 2l, 1gal
    },
}, {timestamps: true});


const StaffCartRefillModel = mongoose.model('StaffCartRefill', StaffCartRefillSchema);
module.exports = StaffCartRefillModel;
