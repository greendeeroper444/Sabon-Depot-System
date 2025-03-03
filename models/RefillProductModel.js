const mongoose = require('mongoose');


const RefillProductSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
    },
    volume: {
        type: Number,
    },
    maximumSizeLiter: {
        type: Number,
        default: 105
    },
    color: {
        type: String,
        default: 'blue'
    },
    uploaderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
    },
    uploaderType: {
        type: String,
        required: true,
        enum: ['Admin', 'Staff']
    },
    createdBy: {
        type: String,
        required: true,
        trim: true
    },
    updatedBy: {
        type: String,
        trim: true
    },
}, {timestamps: true});

const RefillProductModel = mongoose.model('RefillProduct', RefillProductSchema);
module.exports = RefillProductModel;