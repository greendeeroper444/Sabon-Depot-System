const mongoose = require('mongoose');


const ProductCategorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
    },
}, timestamp = true);


const ProductCategoryModel = mongoose.model('ProductCategory', ProductCategorySchema);
module.exports = ProductCategoryModel;
