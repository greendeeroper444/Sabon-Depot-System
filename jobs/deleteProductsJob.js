// const schedule = require('node-schedule');
// const ProductModel = require('../models/ProductModel');

// //schedule the job to run every day at midnight (00:00)
// schedule.scheduleJob('0 0 * * *', async () => {
//     try {
        
//         const currentDate = new Date();

//         //find all products where expirationDate matches the current date
//         const expiredProducts = await ProductModel.find({
//             expirationDate: {
//                 $lte: currentDate //expiration date is today or earlier
//             }
//         });

//         if(expiredProducts.length > 0){
//             //delete the expired products
//             await ProductModel.deleteMany({
//                 expirationDate: {
//                     $lte: currentDate
//                 }
//             });

//             console.log(`Deleted ${expiredProducts.length} expired products.`);
//         } else {
//             console.log('No expired products found.');
//         }
//     } catch (error) {
//         console.error('Error deleting products:', error);
//     }
// });


const schedule = require('node-schedule');
const ProductModel = require('../models/ProductModel');
const AdminNotificationModel = require('../models/AdminModels/AdminNotificationModel');
const CartModel = require('../models/CartModel');
const StaffCartModel = require('../models/StaffModels/StaffCartModel');
const AdminNotificationOrderModel = require('../models/AdminModels/AdminNotificationOrderModel');
const StaffCartRefillModel = require('../models/StaffModels/StaffCartRefillModel');

schedule.scheduleJob('0 0 * * *', async() => {
    try {
        const currentDate = new Date();

        //notify and handle expiring products
        for(let i = 1; i <= 3; i++){
            const notifyDate = new Date(currentDate);
            notifyDate.setDate(currentDate.getDate() + i);

            //find products with expirationDate matching the notifyDate
            const expiringProducts = await ProductModel.find({
                expirationDate: {
                    $eq: notifyDate.toISOString().split('T')[0], //compare date only, not time
                },
            });

            for(const product of expiringProducts){
                const notificationMessage = `${i} day(s) left before expiration for product: ${product.productName}`;
                const notification = new AdminNotificationModel({
                    message: notificationMessage,
                    productId: product._id,
                    expirationDate: product.expirationDate,
                    productName: product.productName,
                    createdAt: new Date(),
                });
                await notification.save();
            }

            if(expiringProducts.length > 0){
                console.log(
                    `Sent notification for ${expiringProducts.length} product(s) expiring in ${i} day(s).`
                );
            }
        }

        //delete expired products
        const expiredProducts = await ProductModel.find({
            expirationDate: {$lte: currentDate.toISOString().split('T')[0]},
        });

        if(expiredProducts.length > 0){
            for (const product of expiredProducts) {

                await CartModel.deleteMany({productId: product._id});
                await StaffCartModel.deleteMany({productId: product._id});
                await StaffCartRefillModel.deleteMany({productId: product._id});
                await AdminNotificationOrderModel.deleteMany({productId: product._id});

                console.log(`Removed product from carts: ${product.productName}`);

                await ProductModel.findByIdAndDelete(product._id);
                console.log(`Deleted expired product: ${product.productName}`);
            }
        }
    } catch (error) {
        console.error('Error handling product expiration:', error);
    }
});

//schedule the job to run every day at midnight
// schedule.scheduleJob('0 0 * * *', async() => {
//     try {
//         const currentDate = new Date();

//         //loop through the next 3 days (3 days, 2 days, 1 day before expiration)
//         for(let i = 1; i <= 3; i++){
//             const notifyDate = new Date(currentDate);
//             notifyDate.setDate(currentDate.getDate() + i); //move forward 1 day, 2 days, or 3 days

//             //find products with expirationDate matching the notifyDate
//             const expiringProducts = await ProductModel.find({
//                 expirationDate: {
//                     $eq: notifyDate.toISOString().split('T')[0] //compare date only, not time
//                 }
//             });

//             if(expiringProducts.length > 0){
//                 //create notification for expiring products
//                 for (let product of expiringProducts) {
//                     const notificationMessage = `${i} day(s) left before expiration for product: ${product.productName}`;
//                     const notification = new AdminNotificationModel({
//                         message: notificationMessage,
//                         productId: product._id,
//                         expirationDate: product.expirationDate,
//                         productName: product.productName,
//                         createdAt: new Date()
//                     });
//                     await notification.save();
//                 }

//                 console.log(`Sent notification for ${expiringProducts.length} product(s) expiring in ${i} day(s).`);
//             }
//         }
//     } catch (error) {
//         console.error('Error sending product expiration notifications:', error);
//     }
// });


// schedule.scheduleJob('0 0 * * *', async() => {
//     try {
//         const currentDate = new Date();
    
//         //loop through the next 3 days (3 days, 2 days, 1 day before expiration)
//         for (let i = 1; i <= 3; i++) {
//             const notifyDate = new Date(currentDate);
//                 notifyDate.setDate(currentDate.getDate() + i); //move forward 1 day, 2 days, or 3 days
        
//                 //find products with expirationDate matching the notifyDate
//                 const expiringProducts = await ProductModel.find({
//                 expirationDate: {
//                     $eq: notifyDate.toISOString().split('T')[0], //compare date only, not time
//                 },
//             });
        
//             if(expiringProducts.length > 0){
//             //group products by batch
//             const groupedByBatch = expiringProducts.reduce((acc, product) => {
//                 if(!acc[product.batch]){
//                     acc[product.batch] = [];
//                 }
//                     acc[product.batch].push(product);
//                     return acc;
//             }, {});
    
//             //create a notification for each batch
//             for(const [batch, products] of Object.entries(groupedByBatch)){
//                 const notificationMessage = `${i} day(s) left before expiration for ${products.length} product(s) in batch "${batch}".`;
//                     const notification = new AdminNotificationModel({
//                     message: notificationMessage,
//                     productId: products.map((p) => p._id),
//                     expirationDate: notifyDate,
//                     batch,
//                     createdAt: new Date(),
//                 });
//                 await notification.save();
//             }
    
//             console.log(`Sent notification for ${Object.keys(groupedByBatch).length} batch(es) expiring in ${i} day(s).`);
//             }
//         }
//     } catch (error) {
//         console.error('Error sending product expiration notifications:', error);
//     }
// });