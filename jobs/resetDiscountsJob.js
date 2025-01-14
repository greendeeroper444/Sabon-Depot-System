const schedule = require('node-schedule');
const ProductModel = require('../models/ProductModel');

//schedule the job to run every hour
schedule.scheduleJob('0 * * * *', async() => {
    try {
        const now = new Date();
        const products = await ProductModel.find({ 
            discountedDate: {$lte: now}, 
            discountPercentage: {$gt: 0} 
        });

        for(const product of products){
            product.discountPercentage = 0;
            product.discountedPrice = product.price;
            await product.save();
        }

        console.log(`${products.length} products updated.`);
    } catch (error) {
        console.error('Error resetting discounts:', error);
    }
});
