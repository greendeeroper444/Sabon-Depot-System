const cron = require('node-cron');
const moment = require('moment-timezone');
const OrderModel = require('../models/OrderModel');
const NotificationModel = require('../models/NotificationModel');

//function to check and cancel expired orders
// const checkExpiredOrdersJob = async () => {
//     try {
//         console.log('Running order expiration check...');

//         //get current time in Singapore timezone
//         const currentTime = moment().tz('Asia/Singapore');

//         //find orders where pickup time has passed
//         const orders = await OrderModel.find({ 
//             orderStatus: {$ne: 'Cancelled'} 
//         });

//         for(const order of orders){
//             if(!order.pickupDate || !order.pickupTime || order.pickupTime.length === 0) continue;

//             const pickupDateTimeString = `${order.pickupDate} ${order.pickupTime[0].split(' - ')[1]}`;
//             const pickupDeadline = moment.tz(pickupDateTimeString, 'YYYY-MM-DD h:mm A', 'Asia/Singapore');

//             if(currentTime.isAfter(pickupDeadline)){
//                 console.log(`Order ${order.orderNumber} has expired. Cancelling...`);

//                 await OrderModel.updateOne(
//                     { 
//                         _id: order._id 
//                     },
//                     {
//                         paymentStatus: 'Cancelled',
//                         orderStatus: 'Cancelled',
//                     }
//                 );
//             }
//         }

//         console.log('Order expiration check completed.');
//     } catch (error) {
//         console.error('Error checking expired orders:', error);
//     }
// };
const checkExpiredOrdersJob = async() => {
    try {
        console.log('Running order expiration check...');

        //get current time in Singapore timezone
        const currentTime = moment().tz('Asia/Singapore');

        //find orders where pickup time has passed, but ignore already picked-up and paid orders
        const orders = await OrderModel.find({ 
            orderStatus: {$nin: ['Cancelled', 'Picked Up']}, 
            paymentStatus: {$ne: 'Paid'} 
        });

        for(const order of orders){
            if(!order.pickupDate || !order.pickupTime || order.pickupTime.length === 0) continue;

            //construct pickup deadline
            const pickupDateTimeString = `${order.pickupDate} ${order.pickupTime[0].split(' - ')[1]}`;
            const pickupDeadline = moment.tz(pickupDateTimeString, 'YYYY-MM-DD h:mm A', 'Asia/Singapore');

            //check if the order has expired
            if(currentTime.isAfter(pickupDeadline)){
                console.log(`Order ${order.orderNumber} has expired. Cancelling...`);

                await OrderModel.updateOne(
                    {_id: order._id},
                    {
                        paymentStatus: 'Cancelled',
                        orderStatus: 'Cancelled',
                    }
                );

                await NotificationModel.create({
                    customerId: order.customerId,
                    orderId: order._id,
                    message: `Your order ${order.orderNumber} has been cancelled due to missed pickup time.`,
                });

                console.log(`Notification sent to customer ${order.customerId} for order ${order.orderNumber}.`);
            }
        }

        console.log('Order expiration check completed.');
    } catch (error) {
        console.error('Error checking expired orders:', error);
    }
};

//run every hour
cron.schedule('0 * * * *', checkExpiredOrdersJob);

module.exports = checkExpiredOrdersJob;
