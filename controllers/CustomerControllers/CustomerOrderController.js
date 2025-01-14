const CartModel = require("../../models/CartModel");
const CustomerAuthModel = require("../../models/CustomerModels/CustomerAuthModel");
const OrderModel = require("../../models/OrderModel");
const path = require('path');
const multer = require('multer');
const ProductModel = require("../../models/ProductModel");
const { BestSellingModel, TotalSaleModel } = require("../../models/SalesOverviewModel");
const { getInventoryReport, getSalesReport } = require("../AdminControllers/AdminReportController");
const mongoose = require('mongoose');
const NotificationStaffModel = require("../../models/StaffModels/NotificationStaffModel");
const NotificationModel = require("../../models/NotificationModel");
const AdminNotificationModel = require("../../models/AdminModels/AdminNotificationModel");
const AdminNotificationOrderModel = require("../../models/AdminModels/AdminNotificationOrderModel");

//set up storage engine
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/paymentProofs');
    },
    filename: function(req, file, cb){
        const uniqueSuffix = '-' + Date.now() + path.extname(file.originalname);
        cb(null, file.originalname.replace(path.extname(file.originalname), '') + uniqueSuffix);
    }
});

//initialize upload
const upload = multer({
    storage: storage,
    limits: {fileSize: 5 * 1024 * 1024},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('paymentProof');

//check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// const handlePickupPayment = async({ pickupDate, pickupTime, orderId }) => {
//     // Logic for updating the order with Pickup details
//     try {
//         const order = await OrderModel.findById(orderId);
//         if (!order) {
//             throw new Error('Order not found');
//         }

//         order.isPending = true;
//         order.isReady = false;
//         order.isPickedUp = false;
//         order.pendingDate = Date.now();
//         order.pickupDate = pickupDate;
//         order.pickupTime = pickupTime;
//         await order.save();

//         return order;
//     } catch (error) {
//         console.error(error);
//         throw new Error('Error handling pickup payment');
//     }
// };

// const handleCodPayment = async({ orderId }) => {
//     // Logic for handling Cash On Delivery (COD) payment
//     try {
//         const order = await OrderModel.findById(orderId);
//         if (!order) {
//             throw new Error('Order not found');
//         }

//         order.isPending = true;
//         order.isShipped = false;
//         order.isOutForDelivery = false;
//         order.isDelivered = false;
//         order.pendingDate = Date.now();
//         await order.save();

//         return order;
//     } catch (error) {
//         console.error(error);
//         throw new Error('Error handling COD payment');
//     }
// };

// const createOrderCustomer = async(req, res) => {
//     try {
//         const {
//             customerId,
//             paymentMethod,
//             selectedItems,
//             billingDetails,
//             pickupDate,
//             pickupTime, 
//         } = req.body;

//         let parsedBillingDetails = {};

//         try {
//             parsedBillingDetails = JSON.parse(billingDetails);
//         } catch (error) {
//             return res.status(400).json({
//                 message: 'Invalid billing details format.'
//             });
//         }

//         //validate billing details
//         if(
//             !parsedBillingDetails.firstName ||
//             !parsedBillingDetails.lastName ||
//             !parsedBillingDetails.middleInitial ||
//             !parsedBillingDetails.contactNumber ||
//             !parsedBillingDetails.province ||
//             !parsedBillingDetails.city ||
//             !parsedBillingDetails.barangay ||
//             !parsedBillingDetails.purokStreetSubdivision ||
//             !parsedBillingDetails.emailAddress ||
//             !parsedBillingDetails.clientType
//         ){
//             return res.status(400).json({
//                 message: 'Billing details are required.'
//             });
//         }

//         //fetch selected cart items for the customer
//         const cartItems = await CartModel.find({
//             _id: {$in: selectedItems},
//             customerId,
//         }).populate('productId');

//         if(cartItems.length === 0){
//             return res.status(400).json({
//                 message: 'No items selected from the cart',
//             });
//         }

//         //check if the customer is new
//         const customerExists = await CustomerAuthModel.findById(customerId);
//         const currentTime = Date.now();
//         // const isNewCustomer = customerExists.isNewCustomer && currentTime <= customerExists.newCustomerExpiresAt;
//         const isNewCustomer = customerExists.isNewCustomer;

//         //calculate total amount
//         const totalAmount = cartItems.reduce((acc, item) => {
//             const originalPrice = item.productId.price;
//             let discountedPrice = originalPrice;

//             //calculate discounted price
//             if(item.productId.discountPercentage && item.productId.discountPercentage > 0){
//                 discountedPrice = originalPrice - (originalPrice * item.productId.discountPercentage / 100);
//             }

//             if(isNewCustomer){
//                 discountedPrice = discountedPrice - (discountedPrice * 0.30); //apply 30% discount
//             }

//             //determine final price based on new customer status
//             let finalPrice = discountedPrice;
//             if(isNewCustomer){
//                 finalPrice = discountedPrice;
//             } else{
//                 finalPrice = originalPrice;
//             }

//             item.finalPrice = finalPrice; //set the finalPrice for the item
//             return acc + finalPrice * item.quantity;
//         }, 0);

//         const shippingCost = 50;
//         const totalAmountWithShipping = totalAmount + shippingCost;

//         let order;

//         if(paymentMethod === 'Pick Up'){
//             // Handle Pick Up payment with pickup date and time
//             order = await handlePickupPayment({
//                 pickupDate,
//                 pickupTime,
//                 orderId: null  // Will create order below
//             });
//         } else if(paymentMethod === 'Cash On Delivery'){
//             // Handle Cash On Delivery payment
//             order = await handleCodPayment({
//                 orderId: null  // Will create order below
//             });
//         }
        
//         //create the order
//         const newOrder  = new OrderModel({
//             customerId,
//             items: cartItems.map(item => ({
//                 productId: item.productId._id,
//                 productCode: item.productId.productCode,
//                 productName: item.productId.productName,
//                 category: item.productId.category,
//                 price: item.productId.price,
//                 discountPercentage: item.productId.discountPercentage,
//                 discountedPrice: item.discountedPrice,
//                 finalPrice: item.finalPrice,
//                 quantity: item.quantity,
//                 uploaderId: item.productId.uploaderId,
//                 uploaderType: item.productId.uploaderType,
//                 imageUrl: item.productId.imageUrl,
//                 sizeUnit:  item.productId.sizeUnit,
//                 productSize: item.productId.productSize,
//                 createdProductBy: item.productId.createdBy,
//                 createdProductAt: item.productId.createdAt,
//                 updatedProductBy: item.productId.updatedBy,
//                 updatedProductAt: item.productId.updatedAt,
//             })),
//             totalAmount: totalAmountWithShipping,
//             paymentMethod,
//             billingDetails: parsedBillingDetails,
//             paymentStatus: 'Unpaid',
//             orderStatus: 'Pending',
//         });

//         await newOrder.save();

//         //update product quantities based on the order
//         await Promise.all(cartItems.map(async (item) => {
//             await ProductModel.findByIdAndUpdate(item.productId._id, {
//                 $inc: {quantity: -item.quantity} //decrease product quantity
//             });

//             const today = new Date();
//             today.setUTCHours(0, 0, 0, 0); //set time to midnight for the day field
//             const existingRecord = await TotalSaleModel.findOne({
//                 productName: item.productId.productName,
//                 day: today,
//             });

//             if(existingRecord){
//                 //update existing record
//                 await TotalSaleModel.updateOne(
//                     {_id: existingRecord._id},
//                     {
//                         $inc: {
//                             totalProduct: 1,
//                             totalSales: item.productId.price * item.quantity,
//                             quantitySold: item.quantity,
//                         },
//                     }
//                 );
//             } else{
//                 //create a new record
//                 await TotalSaleModel.create({
//                     productName: item.productId.productName,
//                     totalProduct: 1,
//                     totalSales: item.productId.price * item.quantity,
//                     quantitySold: item.quantity,
//                     day: today,
//                 });
//             }

//             //get all best selling
//             //update bestSellingRecord model
//             const bestSellingRecord = await BestSellingModel.findOne({productId: item.productId._id});
//             if(bestSellingRecord){
//                 //update existing record
//                 bestSellingRecord.totalProduct += 1;
//                 bestSellingRecord.totalSales += item.finalPrice * item.quantity;
//                 bestSellingRecord.quantitySold += item.quantity;
//                 bestSellingRecord.lastSoldAt = Date.now();
//                 await bestSellingRecord.save();
//             } else{
//                 //create a new record
//                 await BestSellingModel.create({
//                     productId: item.productId._id,
//                     productName: item.productId.productName,
//                     totalSales: item.finalPrice * item.quantity,
//                     quantitySold: item.quantity,
//                     sizeUnit: item.productId.sizeUnit,
//                     productSize: item.productId.productSize,
//                     lastSoldAt: Date.now(),
//                 });
//             }

//             await getSalesReport(
//                 item.productId._id,
//                 item.productId.productName,
//                 item.productId.sizeUnit,
//                 // item.productId.productSize,
//                 item.productId.category,
//                 item.productId.price,
//                 item.quantity,
//                 true
//             );
//             console.log('Nganong dika mogawas price waa ka', {
//                 productId: item.productId._id,
//                 productName: item.productId.productName,
//                 sizeUnit: item.productId.sizeUnit,
//                 // productSize: item.productId.productSize,
//                 category: item.productId.category,
//                 price: item.productId.price,
//                 quantity: item.quantity,
//             });
            
            

//         }));


//         //remove selected items from the cart
//         await CartModel.deleteMany({
//             _id: {$in: selectedItems},
//             customerId,
//         });

//         res.status(201).json({
//             message: 'Order created successfully',
//             orderId: order._id,
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             message: 'Server error'
//         });
//     }
// };

// const createOrderCustomer = async (req, res) => {
//     try {
//         const {
//             customerId,
//             items,
//             totalAmount,
//             billingDetails,
//             pickUpDateTime,
//         } = req.body;

//         // Validate required fields
//         if (!customerId || !items || !items.length || !totalAmount || !billingDetails) {
//             return res.status(400).json({ message: 'Missing required fields' });
//         }

//         // Validate pickUpDateTime
//         const pickUpDate = new Date(pickUpDateTime);
//         if (isNaN(pickUpDate.getTime()) || pickUpDate < Date.now()) {
//             return res.status(400).json({ message: 'Invalid or past pickup date and time' });
//         }

//         // Create a new order
//         const newOrder = new IndividualOrderModel({
//             customerId,
//             items,
//             totalAmount,
//             billingDetails,
//             pickUpDateTime: pickUpDate,
//         });

//         // Save the order to the database
//         const savedOrder = await newOrder.save();

//         return res.status(201).json({
//             message: 'Order created successfully',
//             order: savedOrder,
//         });
//     } catch (error) {
//         console.error('Error creating order:', error);
//         return res.status(500).json({
//             message: 'Server error',
//         });
//     }
// };


// const createOrderCustomer = async(req, res) => {
//      upload(req, res, async(err) => {
//         if(err){
//             return res.status(400).json({
//                 message: err
//             });
//         }

//         try {
//             const {
//                 customerId, 
//                 paymentMethod, 
//                 selectedItems, 
//                 billingDetails, 
//                 partialPayment = 0, 
//                 gcashPaid = 0
//             } = req.body;
//             const paymentProof = req.file ? req.file.path : null;

//             let parsedBillingDetails = {};

//             try {
//                 parsedBillingDetails = JSON.parse(billingDetails);
//             } catch (error) {
//                 return res.status(400).json({ 
//                     message: 'Invalid billing details format.'
//                 });
//             }
            
//             //validate billingDetails
//             if(
//                 !parsedBillingDetails.fullName || 
//                 !parsedBillingDetails.emailAddress || 
//                 !parsedBillingDetails.contactNumber || 
//                 !parsedBillingDetails.city || 
//                 !parsedBillingDetails.address
//             ){
//                 return res.status(400).json({ 
//                     message: 'Billing details are required.' 
//                 });
//             }

//             if(paymentMethod === 'Gcash' && !paymentProof){
//                 return res.status(400).json({ 
//                     message: 'Payment proof is required for Gcash payment.' 
//                 });
//             }
            

//             //fetch selected cart items for the customer
//             const cartItems = await CartModel.find({
//                 _id: {$in: selectedItems},
//                 customerId,
//             }).populate('productId');

//             if(cartItems.length === 0){
//                 return res.status(400).json({
//                     message: 'No items selected from the cart',
//                 });
//             }

//             //check if the customer is new
//             const customerExists = await CustomerAuthModel.findById(customerId);
//             const currentTime = Date.now();
//             const isNewCustomer = customerExists.isNewCustomer && currentTime <= customerExists.newCustomerExpiresAt;

//             //calculate total amount
//             const totalAmount = cartItems.reduce((acc, item) => {
//                 const originalPrice = item.productId.price;
//                 let discountedPrice = originalPrice;

//                 //calculate discounted price
//                 if(item.productId.discountPercentage && item.productId.discountPercentage > 0){
//                     discountedPrice = originalPrice - (originalPrice * item.productId.discountPercentage / 100);
//                 }

//                 //determine final price based on new customer status
//                 let finalPrice = discountedPrice;
//                 if(isNewCustomer){
//                     finalPrice = discountedPrice;
//                 } else{
//                     finalPrice = originalPrice;
//                 }

//                 item.finalPrice = finalPrice; //set the finalPrice for the item
//                 return acc + finalPrice * item.quantity;
//             }, 0);

//             const shippingCost = 50;
//             const totalAmountWithShipping = totalAmount + shippingCost;

//             //calculate outstanding amount and payment status
//             const outstandingAmount = totalAmountWithShipping - partialPayment;
//             const paymentStatus = outstandingAmount > 0 ? 'Partial' : 'Paid';

//             //create the order
//             const order = new OrderModel({
//                 customerId,
//                 items: cartItems.map(item => ({
//                     productId: item.productId._id,
//                     productCode: item.productId.productCode,
//                     productName: item.productId.productName,
//                     category: item.productId.category,
//                     price: item.productId.price,
//                     discountPercentage: item.productId.discountPercentage,
//                     discountedPrice: item.discountedPrice,
//                     finalPrice: item.finalPrice,
//                     quantity: item.quantity,
//                     uploaderId: item.productId.uploaderId,
//                     uploaderType: item.productId.uploaderType,
//                     imageUrl: item.productId.imageUrl,
//                     createdProductBy: item.productId.createdBy,
//                     createdProductAt: item.productId.createdAt,
//                     updatedProductBy: item.productId.updatedBy,
//                     updatedProductAt: item.productId.updatedAt,
//                 })),
//                 totalAmount: totalAmountWithShipping,
//                 paymentProof: paymentMethod === 'Gcash' ? paymentProof : null,
//                 gcashPaid,
//                 partialPayment,
//                 outstandingAmount,
//                 paymentMethod,
//                 billingDetails: parsedBillingDetails,
//                 paymentStatus,
//                 orderStatus: 'On Delivery',
//             });

//             await order.save();

//             //remove selected items from the cart
//             await CartModel.deleteMany({
//                 _id: {$in: selectedItems},
//                 customerId,
//             });

//             res.status(201).json({
//                 message: 'Order created successfully',
//                 orderId: order._id,
//             });
//         } catch (error) {
//             console.error(error);
//             return res.status(500).json({
//                 message: 'Server error'
//             });
//         }
//    });
// };

// const createOrderCustomer = async(req, res) => {
//     try {
//         const {customerId, paymentMethod, selectedItems, billingDetails, partialPayment = 0} = req.body;

//         //fetch selected cart items for the customer
//         const cartItems = await CartModel.find({
//             _id: {$in: selectedItems},
//             customerId,
//         }).populate('productId');

//         if(cartItems.length === 0){
//             return res.status(400).json({
//                 message: 'No items selected from the cart',
//             });
//         }

//         //calculate total amount
//         // const totalAmount = cartItems.reduce(
//         //     (acc, item) => acc + item.productId.price * item.quantity,
//         //     0
//         // );

//         // const totalAmount = cartItems.reduce(
//         //     (acc, item) => {
//         //         const price = item.discountedPrice !== undefined ? item.discountedPrice : item.productId.price;
//         //         return acc + price * item.quantity;
//         //     },
//         //     0
//         // );
//         const totalAmount = cartItems.reduce(
//             (acc, item) => {
//                 const price = item.discountedPrice !== undefined ? item.discountedPrice : item.productId.price;
//                 return acc + price * item.quantity;
//             },
//             0
//         );

//         const shippingCost = 50;
//         const totalAmountWithShipping = totalAmount + shippingCost;

//         //calculate outstanding amount and payment status
//         const outstandingAmount = totalAmountWithShipping - partialPayment;
//         const paymentStatus = outstandingAmount > 0 ? 'Partial' : 'Paid';


//         const order = new OrderModel({
//             customerId,
//             items: cartItems.map(item => ({
//                 productId: item.productId._id,
//                 productCode: item.productId.productCode,
//                 productName: item.productId.productName,
//                 category: item.productId.category,
//                 price: item.productId.price,
//                 discountPercentage: item.productId.discountPercentage,
//                 discountedPrice: item.productId.discountedPrice,
//                 quantity: item.quantity,
//                 uploaderId: item.productId.uploaderId,
//                 uploaderType: item.productId.uploaderType,
//                 imageUrl: item.productId.imageUrl,
//                 createdProductBy: item.productId.createdBy,
//                 createdProductAt: item.productId.createdAt,
//                 updatedProductBy: item.productId.updatedBy,
//                 updatedProductAt: item.productId.updatedAt,
//             })),
//             totalAmount: totalAmountWithShipping,
//             partialPayment,
//             outstandingAmount,
//             paymentMethod,
//             billingDetails,
//             paymentStatus, 
//             orderStatus: 'On Delivery',
//         });

//         await order.save();

//         //remove selected items from the cart
//         await CartModel.deleteMany({
//             _id: {$in: selectedItems},
//             customerId,
//         });

//         res.status(201).json({
//             message: 'Order created successfully',
//             orderId: order._id,
//         });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ 
//             message: 'Server error' 
//         });
//     }
// };



const createOrderCustomer = async(req, res) => {
    try {
        const {
            customerId,
            paymentMethod,
            selectedItems,
            billingDetails,
            pickupDate,
            pickupTime,
        } = req.body;

        let parsedBillingDetails = {};

        try {
            if(typeof billingDetails === 'string') {
                parsedBillingDetails = JSON.parse(billingDetails);
            } else{
                parsedBillingDetails = billingDetails;
            }
            console.log('Parsed billing details:', parsedBillingDetails);
        } catch (error) {
            return res.status(400).json({
                message: 'Invalid billing details format.',
                error: error.message
            });
        }

        //validate billing details
        if(
            !parsedBillingDetails.firstName ||
            !parsedBillingDetails.lastName ||
            !parsedBillingDetails.middleInitial ||
            !parsedBillingDetails.contactNumber ||
            !parsedBillingDetails.province ||
            !parsedBillingDetails.city ||
            !parsedBillingDetails.barangay ||
            !parsedBillingDetails.purokStreetSubdivision ||
            !parsedBillingDetails.emailAddress ||
            !parsedBillingDetails.clientType
        ) {
            return res.status(400).json({
                message: 'Billing details are required.'
            });
        }

        //fetch selected cart items for the customer
        const cartItems = await CartModel.find({
            _id: {$in: selectedItems},
            customerId,
        }).populate('productId');

        if(cartItems.length === 0){
            return res.status(400).json({
                message: 'No items selected from the cart',
            });
        }

        //check if the customer exists
        const customerExists = await CustomerAuthModel.findById(customerId);
        const currentTime = Date.now();
        const isNewCustomer = customerExists.isNewCustomer;

        //calculate total amount
        const totalAmount = cartItems.reduce((acc, item) => {
            const originalPrice = item.productId.discountedPrice;
            let discountedPrice = originalPrice;

            //calculate discounted price
            if(item.productId.discountPercentage && item.productId.discountPercentage > 0) {
                discountedPrice = originalPrice - (originalPrice * item.productId.discountPercentage / 100);
            }

            if(isNewCustomer){
                discountedPrice = discountedPrice - (discountedPrice * 0.30); //apply 30% discount
            }

            let finalPrice = discountedPrice;
            if(isNewCustomer){
                finalPrice = discountedPrice;
            } else{
                finalPrice = originalPrice;
            }

            item.finalPrice = finalPrice;
            return acc + finalPrice * item.quantity;
        }, 0);

        const shippingCost = 0;
        const totalAmountWithShipping = totalAmount + shippingCost;

        let order;

        if(paymentMethod === 'Pick Up'){
            //handle Pick Up payment with pickup date and time
            order = new OrderModel({
                customerId,
                items: cartItems.map(item => ({
                    productId: item.productId._id,
                    productCode: item.productId.productCode,
                    productName: item.productId.productName,
                    category: item.productId.category,
                    price: item.productId.price,
                    discountPercentage: item.productId.discountPercentage,
                    discountedPrice: item.discountedPrice,
                    finalPrice: item.finalPrice,
                    quantity: item.quantity,
                    uploaderId: item.productId.uploaderId,
                    uploaderType: item.productId.uploaderType,
                    imageUrl: item.productId.imageUrl,
                    sizeUnit: item.productId.sizeUnit,
                    productSize: item.productId.productSize,
                    desciption: item.productId.description,
                    refillPrice: item.productId.refillPrice,
                    createdProductBy: item.productId.createdBy,
                    createdProductAt: item.productId.createdAt,
                    updatedProductBy: item.productId.updatedBy,
                    updatedProductAt: item.productId.updatedAt,
                })),
                totalAmount: totalAmountWithShipping,
                paymentMethod: 'Pick Up',
                billingDetails: parsedBillingDetails,
                paymentStatus: 'Unpaid',
                orderStatus: 'Pending',
                pickupDate,
                pickupTime,
            });
        } else if(paymentMethod === 'Cash On Delivery'){
            //handle Cash On Delivery payment without pickup details
            order = new OrderModel({
                customerId,
                items: cartItems.map(item => ({
                    productId: item.productId._id,
                    productCode: item.productId.productCode,
                    productName: item.productId.productName,
                    category: item.productId.category,
                    price: item.productId.price,
                    discountPercentage: item.productId.discountPercentage,
                    discountedPrice: item.discountedPrice,
                    finalPrice: item.finalPrice,
                    quantity: item.quantity,
                    uploaderId: item.productId.uploaderId,
                    uploaderType: item.productId.uploaderType,
                    imageUrl: item.productId.imageUrl,
                    sizeUnit: item.productId.sizeUnit,
                    productSize: item.productId.productSize,
                    desciption: item.productId.description,
                    refillPrice: item.productId.refillPrice,
                    createdProductBy: item.productId.createdBy,
                    createdProductAt: item.productId.createdAt,
                    updatedProductBy: item.productId.updatedBy,
                    updatedProductAt: item.productId.updatedAt,
                })),
                totalAmount: totalAmountWithShipping,
                paymentMethod: 'Cash On Delivery',
                billingDetails: parsedBillingDetails,
                paymentStatus: 'Unpaid',
                orderStatus: 'Pending',
            });
        }

        await order.save();

        //update product quantities based on the order
        await Promise.all(cartItems.map(async (item) => {
            await ProductModel.findByIdAndUpdate(item.productId._id, {
                $inc: { quantity: -item.quantity } //decrease product quantity
            });

            const today = new Date();
            today.setUTCHours(0, 0, 0, 0); //set time to midnight for the day field
            const existingRecord = await TotalSaleModel.findOne({
                productName: item.productId.productName,
                day: today,
            });

            if(existingRecord){
                await TotalSaleModel.updateOne(
                    {_id: existingRecord._id},
                    {
                        $inc: {
                            totalProduct: 1,
                            totalSales: item.productId.price * item.quantity,
                            quantitySold: item.quantity,
                        },
                    }
                );
            } else{
                await TotalSaleModel.create({
                    imageUrl: item.productId.imageUrl,
                    productName: item.productId.productName,
                    price: item.productId.price,
                    totalProduct: 1,
                    totalSales: item.productId.price * item.quantity,
                    quantitySold: item.quantity,
                    day: today,
                });
            }

            const bestSellingRecord = await BestSellingModel.findOne({ productId: item.productId._id });
            if(bestSellingRecord){
                bestSellingRecord.totalProduct += 1;
                bestSellingRecord.totalSales += item.finalPrice * item.quantity;
                bestSellingRecord.quantitySold += item.quantity;
                bestSellingRecord.lastSoldAt = Date.now();
                await bestSellingRecord.save();
            } else{
                await BestSellingModel.create({
                    productId: item.productId._id,
                    imageUrl: item.productId.imageUrl,
                    productName: item.productId.productName,
                    totalSales: item.finalPrice * item.quantity,
                    quantitySold: item.quantity,
                    price: item.productId.price,
                    sizeUnit: item.productId.sizeUnit,
                    productSize: item.productId.productSize,
                    desciption: item.productId.description,
                    refillPrice: item.productId.refillPrice,
                    lastSoldAt: Date.now(),
                });
            }

            await getInventoryReport(
                item.productId._id,
                item.productId.productName,
                item.productId.sizeUnit,
                item.productId.productSize,
                item.productId.category,
                item.quantity,
                true
            );


            await getSalesReport(
                item.productId._id,
                item.productId.productName,
                item.productId.sizeUnit,
                item.productId.category,
                item.productId.price,
                item.quantity,
                true
            );
        }));



        //create notifications for each item
        const notifications = cartItems.map(item => ({
            customerId,
            orderId: order._id,
            productId: item.productId._id,
            productName: item.productId.productName,
            message: `${parsedBillingDetails.firstName} ${parsedBillingDetails.lastName} placed an order for ${item.productId.productName}.`,
        }));

        //save notifications to the database
        await AdminNotificationOrderModel.insertMany(notifications);
        
        //remove selected items from the cart
        await CartModel.deleteMany({
            _id: {$in: selectedItems},
            customerId,
        });

        res.status(201).json({
            message: 'Order created successfully',
            orderId: order._id,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Server error'
        });
    }
};

const directCheckoutCustomer = async(req, res) => {
    try {
        const {
            customerId,
            paymentMethod,
            productDetails,
            quantity,
            billingDetails,
            pickupDate,
            pickupTime,
        } = req.body;

        console.log('Request Body:', req.body);

        if(!productDetails || !productDetails._id){
            return res.status(400).json({ 
                message: 'Invalid product details. Product ID is required.' 
            });
        }

        //parse and validate billing details
        let parsedBillingDetails = {};
        try {
            parsedBillingDetails =
                typeof billingDetails === 'string' ? JSON.parse(billingDetails) : billingDetails;
        } catch (error) {
            return res.status(400).json({ message: 'Invalid billing details format.', error: error.message });
        }

        if (
            !parsedBillingDetails.firstName ||
            !parsedBillingDetails.lastName ||
            !parsedBillingDetails.contactNumber ||
            !parsedBillingDetails.province ||
            !parsedBillingDetails.city ||
            !parsedBillingDetails.barangay ||
            !parsedBillingDetails.purokStreetSubdivision ||
            !parsedBillingDetails.emailAddress ||
            !parsedBillingDetails.clientType
        ) {
            return res.status(400).json({ message: 'Billing details are required.' });
        }

        //find product
        const product = await ProductModel.findById(productDetails._id);
        if(!product){
            return res.status(404).json({ 
                message: 'Product not found.' 
            });
        }
        if(product.quantity < quantity) {
            return res.status(400).json({ 
                message: 'Insufficient stock.' 
            });
        }

        //calculate price
        const isNewCustomer = (await CustomerAuthModel.findById(customerId)).isNewCustomer;
        const discountedPrice = product.discountedPrice || product.price;
        const finalPrice = isNewCustomer
            ? discountedPrice - discountedPrice * 0.3
            : discountedPrice;
        const totalAmount = finalPrice * quantity;

        //create order
        const order = new OrderModel({
            customerId,
            items: [
                {
                    productId: product._id,
                    productName: product.productName,
                    price: product.price,
                    discountedPrice,
                    finalPrice,
                    quantity,
                },
            ],
            totalAmount,
            paymentMethod,
            billingDetails: parsedBillingDetails,
            paymentStatus: 'Unpaid',
            orderStatus: 'Pending',
            pickupDate: paymentMethod === 'Pick Up' ? pickupDate : undefined,
            pickupTime: paymentMethod === 'Pick Up' ? pickupTime : undefined,
        });

        await order.save();

        //update product quantities and handle related models
        await Promise.all(
            order.items.map(async (item) => {
                const {productId, quantity, productName, price, finalPrice} = item;

                try {
                    //update product stock
                    await ProductModel.findByIdAndUpdate(productId, {
                        $inc: { quantity: -quantity },
                    });

                    //handle total sales
                    const today = new Date();
                    today.setUTCHours(0, 0, 0, 0);

                    const existingTotalSale = await TotalSaleModel.findOne({
                        productName,
                        day: today,
                    });

                    if(existingTotalSale){
                        await TotalSaleModel.updateOne(
                            {_id: existingTotalSale._id},
                            {
                                $inc: {
                                    totalProduct: 1,
                                    totalSales: price * quantity,
                                    quantitySold: quantity,
                                },
                            }
                        );
                    } else {
                        await TotalSaleModel.create({
                            productName,
                            price,
                            totalProduct: 1,
                            totalSales: price * quantity,
                            quantitySold: quantity,
                            day: today,
                        });
                    }

                    //handle best-selling records
                    const bestSelling = await BestSellingModel.findOne({productId});
                    if(bestSelling){
                        bestSelling.totalProduct += 1;
                        bestSelling.totalSales += finalPrice * quantity;
                        bestSelling.quantitySold += quantity;
                        bestSelling.lastSoldAt = Date.now();
                        await bestSelling.save();
                    } else{
                        await BestSellingModel.create({
                            productId,
                            productName,
                            price,
                            totalSales: finalPrice * quantity,
                            quantitySold: quantity,
                            lastSoldAt: Date.now(),
                        });
                    }

                    //generate inventory and sales reports
                    await getInventoryReport(productId, productName, '', '', '', quantity, true);
                    await getSalesReport(productId, productName, '', '', price, quantity, true);
                } catch (err) {
                    console.error(`Error updating product data for ${productId}:`, err.message);
                }
            })
        );

        //create notifications
        const notifications = order.items.map((item) => ({
            customerId,
            orderId: order._id,
            productId: item.productId,
            productName: item.productName,
            message: `${parsedBillingDetails.firstName} ${parsedBillingDetails.lastName} placed an order for ${item.productName}.`,
        }));

        await AdminNotificationOrderModel.insertMany(notifications);

        res.status(201).json({
            message: 'Order created successfully',
            orderId: order._id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Server error', error: error.message 
        });
    }
};



const getOrderCustomer = async(req, res) => {
    const {customerId, orderId} = req.params;

    try {
        const order = await OrderModel.findOne({ 
            _id: orderId, 
            customerId 
        }).populate('items.productId');

        if(!order){
            return res.status(404).json({ 
                message: 'Order not found' 
            });
        }
        res.status(200).json({order});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
}



const getAllOrdersCustomer = async(req, res) => {
    const {customerId} = req.params;

    try {
        const orders = await OrderModel.find({customerId}).populate('items.productId');
        res.status(200).json({orders});
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Server error'
        });
    }
}

const uploadProof = async(req, res) => {
    try {
        //wrapping multer's upload logic in a Promise
        await new Promise((resolve, reject) => {
            upload(req, res, (err) => {
                if(err){
                    reject(err);
                } else{
                    resolve();
                }
            });
        });

        const {orderId} = req.params;

        //validate orderId
        if(!mongoose.Types.ObjectId.isValid(orderId)){
            return res.status(400).json({ 
                error: 'Invalid orderId format' 
            });
        }

        const order = await OrderModel.findById(orderId);
        if(!order){
            return res.status(404).json({ 
                error: 'Order not found' 
            });
        }

        const paymentProof = req.file ? req.file.path : '';
        order.paymentProof = paymentProof;

        const updatedOrder = await order.save();

        //create notification
         const notification = new NotificationModel({
            customerId: order.customerId,
            orderId: order._id,
            message: `Payment proof uploaded for Order #${orderId}.`,
        });
        await notification.save();

        res.json({
            message: 'Payment proof uploaded successfully!',
            updatedOrder,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Server error', 
            error 
        });
    }
};

const receivedButton = async(req, res) => {
    const {orderId} = req.params;

    try {
        //find and update the order's `isReceived` field
        const order = await OrderModel.findByIdAndUpdate(
            orderId,
            {isReceived: true, receivedDate: Date.now()},
            {new: true}
        );

        if(!order){
            return res.status(404).json({ 
                message: 'Order not found' 
            });
        }

        //create a notification
        const {customerId, billingDetails} = order;
        const notification = new NotificationStaffModel({
            customerId: customerId,
            orderId: orderId,
            message: `${billingDetails.firstName} ${billingDetails.middleInitial} ${billingDetails.lastName} received the order #${orderId}.`,
        });
        await notification.save();

        res.status(200).json({ 
            message: 'Order received successfully', 
            order 
        });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ 
            message: 'Error updating order', error 
        });
    }
};


module.exports = {
    createOrderCustomer,
    // createDirectOrderCustomer,
    getOrderCustomer,
    getAllOrdersCustomer,
    uploadProof,
    receivedButton,
    directCheckoutCustomer
}