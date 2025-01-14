const ProductCategoryModel = require("../../models/ProductCategoryModel");


const addProductCategory = async (req, res) => {
    try {
        const {categoryName} = req.body;
        const newProductCategory = new ProductCategoryModel({
            categoryName
        });
        await newProductCategory.save();
        res.status(201).json(newProductCategory);
    } catch (error) {
        res.status(500).json({ 
            error: error.message 
        });
    }
}

const getProductCategory = async (req, res) => {
    try {
        const productCategory = await ProductCategoryModel.find();
        res.status(200).json(productCategory);
    } catch (error) {
        res.status(500).json({ 
            error: error.message 
        });
    }
}

const updateProductCategory = async (req, res) => {
    try {
        const {categoryName} = req.body;
        const productCategory = await ProductCategoryModel.findOneAndUpdate({ _id: req.params.id }, { categoryName }, { new: true });
        res.status(200).json(productCategory);
    } catch (error) {
        res.status(500).json({ 
            error: error.message 
        });
    }
}

const deleteProductCategory = async (req, res) => {
    try {
        const productCategory = await ProductCategoryModel.findOneAndDelete({ _id: req.params.id });
        res.status(200).json(productCategory);
    } catch (error) {
        res.status(500).json({ 
            error: error.message 
        });
    }
}


module.exports = {
    addProductCategory,
    getProductCategory,
    updateProductCategory,
    deleteProductCategory
}