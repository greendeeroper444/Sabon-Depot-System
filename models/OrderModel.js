const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    value: {type: Number, default: 0},
});

const CounterModel = mongoose.model('Counter', CounterSchema);

const OrderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    orderNumber: {
        type: String,
        unique: true,
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            productCode: String,
            imageUrl: String,
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
            createdProductBy: String,
            createdProductAt: Date,
            updatedProductBy: String,
            updatedProductAt: Date,
        },
    ],
    pickupDate: {
        type: String,
    },
    pickupTime: {
        type: [String],
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    overallPaid: {
        type: Number,
        default: 0,
    },
    cashReceived: {
        type: Number,
        default: 0
    },
    changeTotal: {
        type: Number,
        default: 0
    },
    paymentMethod: {
        type: String,
        enum: ['Pick Up', 'Cash On Delivery'],
        required: true,
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
        enum: ['Pending', 'Ready', 'Picked Up', 'Shipped', 'Out For Delivery', 'Delivered'],
        default: 'Pending',
    },
    isFullPaidAmount: {
        type: Boolean,
        default: false,
    },
    isPending: {
        type: Boolean,
        default: true,
    },
    isReady: {
        type: Boolean,
        default: false,
    },
    isPickedUp: {
        type: Boolean,
        default: false,
    },
    isShipped: {
        type: Boolean,
        default: false,
    },
    isOutForDelivery: {
        type: Boolean,
        default: false,
    },
    isDelivered: {
        type: Boolean,
        default: false,
    },
    isReceived: {
        type: Boolean,
        default: false,
    },
    pendingDate: {
        type: Date,
    },
    readyDate: {
        type: Date,
    },
    pickedUpDate: {
        type: Date,
    },
    shippedDate: {
        type: Date,
    },
    outForDeliveryDate: {
        type: Date,
    },
    deliveredDate: {
        type: Date,
    },
    receivedDate: {
        type: Date
    },
    whoApproved: {
        type: String,
        default: ''
    },
    receipt: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
});

OrderSchema.pre('save', async function(next){

    // if(!this.orderNumber){
    //     try {
    //         const counter = await CounterModel.findOneAndUpdate(
    //             {name: 'orderNumber'},
    //             {$inc: {value: 1}},
    //             {new: true, upsert: true}
    //         );
    //         this.orderNumber = counter.value;
    //         next();
    //     } catch (error) {
    //         next(error);
    //     }
    // } else{
    //     next();
    // }
    if(!this.orderNumber){
        try {
            //get current date in YYYY-MM-DD format
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}${day}`;

            //find or create a counter for the current date
            const counter = await CounterModel.findOneAndUpdate(
                {name: formattedDate},
                {$inc: {value: 1}},
                {new: true, upsert: true}
            );

            //generate orderNumber in the required format
            const count = String(counter.value).padStart(3, '0');
            this.orderNumber = `${formattedDate}${count}`;

            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }

    if(this.isModified('isPending') && !this.isPending && this.orderStatus === 'Pending'){
        this.pendingDate = Date.now();
    }
    if(this.isModified('isShipped') && this.isShipped && !this.shippedDate){
        this.shippedDate = Date.now();
    }
    if(this.isModified('isReady') && this.isReady && !this.readyDate){
        this.readyDate = Date.now();
    }
    if(this.isModified('isPickedUp') && this.isPickedUp && !this.pickedUpDate){
        this.pickedUpDate = Date.now();
    }
    if(this.isModified('isOutForDelivery') && this.isOutForDelivery && !this.outForDeliveryDate){
        this.outForDeliveryDate = Date.now();
    }
    if(this.isModified('isDelivered') && this.isDelivered && !this.deliveredDate){
        this.deliveredDate = Date.now();
    }
    if(this.isModified('isReceived') && this.isReceived && !this.receivedDate){
        this.receivedDate = Date.now();
    }


    //order status update based on shipping stages
     // Handle orderStatus logic based on payment method
     if (this.paymentMethod === 'Pick Up') {
        if (this.isDelivered) {
            this.orderStatus = 'Picked Up';
        } else if (this.isReady) {
            this.orderStatus = 'Ready';
        } else {
            this.orderStatus = 'Pending';
        }
    } else if(this.paymentMethod === 'Cash On Delivery'){
        if(this.isDelivered){
            this.orderStatus = 'Delivered';
        } else if(this.isOutForDelivery){
            this.orderStatus = 'Out For Delivery';
        }else if(this.isShipped){
            this.orderStatus = 'Shipped';
        } else{
            this.orderStatus = 'Pending';
        }
    }
    next();
});


const OrderModel = mongoose.model('Order', OrderSchema);
module.exports = OrderModel;
