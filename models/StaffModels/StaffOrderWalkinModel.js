const mongoose = require('mongoose');

const StaffOrderWalkinSchema = new mongoose.Schema({
    staffId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'WorkinProgressProduct',
                required: true,
            },
            productCode: String,
            productName: String,
            category: String,
            price: Number,
            discountPercentage: Number,
            discountedPrice: Number,
            finalPrice: Number,
            quantity: Number,
            uploaderId: mongoose.Schema.Types.ObjectId,
            uploaderType: String,
            imageUrl: String,
            sizeUnit:  String,
            productSize: String,
            sizeUnit:  String,
            productSize: String,
            description: String,
            refillPrice: Number,
            createdProductBy: String,
            createdProductAt: Date,
            updatedProductBy: String,
            updatedProductAt: Date,
        },
    ],
    totalAmount: {
        type: Number,
        required: true,
    },
    cashReceived: {
        type: Number,
        default: 0
    },
    changeTotal: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
});

const StaffOrderWalkinModel = mongoose.model('StaffOrderWalkin', StaffOrderWalkinSchema);
module.exports = StaffOrderWalkinModel;
