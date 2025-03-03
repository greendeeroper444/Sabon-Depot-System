const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    value: {type: Number, default: 0},
});

//check if the model already exists before defining it
const CounterModel = mongoose.models.Counter || mongoose.model('Counter', CounterSchema);

const StaffOrderWalkinSchema = new mongoose.Schema({
    staffId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
    },
    orderNumber: {
        type: String,
        unique: true,
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
    whoProcessed: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
});

StaffOrderWalkinSchema.pre('save', async function(next){

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

});

const StaffOrderWalkinModel = mongoose.model('StaffOrderWalkin', StaffOrderWalkinSchema);
module.exports = StaffOrderWalkinModel;
