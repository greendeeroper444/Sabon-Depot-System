const mongoose = require('mongoose');

const IndividualOrderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
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
            createdProductBy: String,
            createdProductAt: Date,
            updatedProductBy: String,
            updatedProductAt: Date,
        },
    ],
    pickUpDateTime: {
        type: String,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    overallPaid: {
        type: Number,
        default: 0,
    },
    billingDetails: {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        middleInitial: {type: String, required: true},
        contactNumber: {type: String, required: true},
        province: {type: String, required: true},
        city: {type: String, required: true},
        barangay: {type: String, required: true},
        purokStreetSubdivision: {type: String, required: true},
        emailAddress: {type: String, required: true},
        clientType: {type: String, required: true},
    },
    paymentStatus: {
        type: String,
        enum: ['Paid', 'Partial', 'Unpaid'],
        default: 'Unpaid',
    },
    orderStatus: {
        type: String,
        enum: [
            'Pending',
            'Confirmed',
            'Ready To Pickup', 
            'Order Completed', 
        ],
        default: 'Pending',
    },
    isPending: {
        type: Boolean,
        default: false,
    },
    isConfirmed: {
        type: Boolean,
        default: false,
    },
    isReadyToPickup: {
        type: Boolean,
        default: false,
    },
    isOrderCompleted: {
        type: Boolean,
        default: false,
    },
    pendingDate: {
        type: Date,
    },
    confirmedDate: {
        type: Date,
    },
    readyToPickupDate: {
        type: Date,
    },
    orderCompletedDate: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
});

IndividualOrderSchema.pre('save', function(next){

    //dates every tracking
    if (this.isModified('isConfirmed') && this.isConfirmed && !this.confirmedDate) {
        this.confirmedDate = Date.now();
        this.isPending = false;
        this.orderStatus = 'Confirmed';
    }
    if (this.isModified('isPending') && !this.isPending && this.orderStatus === 'Pending') {
        this.pendingDate = Date.now();
    }
    if(this.isModified('isReadyToPickup') && this.isReadyToPickup && !this.readyToPickupDate){
        this.readyToPickupDate = Date.now();
    }
    if(this.isModified('isOrderCompleted') && this.isOrderCompleted && !this.orderCompletedDate){
        this.orderCompletedDate = Date.now();
    }


    //order status update based on shipping stages
    if(this.isOrderCompleted){
        this.orderStatus = 'Order Completed';
    }else if (this.isReadyToPickup){
        this.orderStatus = 'Ready To Pickup';
    }else if (this.isConfirmed){
        this.orderStatus = 'Confirmed';
    }else {
        this.orderStatus = 'Pending';
    }
    
    next();
});


const IndividualOrderModel = mongoose.model('IndividualOrder', IndividualOrderSchema);
module.exports = IndividualOrderModel;
