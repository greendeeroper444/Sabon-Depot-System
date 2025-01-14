const ProductSizeModel = require("../../models/ProductSizeModel");


const addProductSize = async (req, res) => {
    try {
        const {sizeUnit, productSize} = req.body;
        const newProductSize = new ProductSizeModel({
            sizeUnit,
            productSize
        });
        await newProductSize.save();
        res.status(201).json(newProductSize);
    } catch (error) {
        res.status(500).json({ 
            error: error.message 
        });
    }
}

const getProductSize = async (req, res) => {
    try {
        const productSize = await ProductSizeModel.find();
        res.status(200).json(productSize);
    } catch (error) {
        res.status(500).json({ 
            error: error.message 
        });
    }
}

const updateProductSize = async (req, res) => {
    try {
        const {sizeUnit, productSize} = req.body;
        const newProductSize = await ProductSizeModel.findOneAndUpdate({_id: req.params.id}, { 
            sizeUnit,
            productSize 
        }, {new: true});
        res.status(200).json(newProductSize);
    } catch (error) {
        res.status(500).json({ 
            error: error.message 
        });
    }
}

const deleteProductSize = async (req, res) => {
    try {
        const newProductSize = await ProductSizeModel.findOneAndDelete({ _id: req.params.id });
        res.status(200).json(newProductSize);
    } catch (error) {
        res.status(500).json({ 
            error: error.message 
        });
    }
}

const getSizeUnitsWithSizes = async(req, res) => {
    try {
        const sizeUnits = await ProductSizeModel.aggregate([
            {
                $group: {
                    _id: "$sizeUnit",
                    sizes: {$push: "$productSize"}
                }
            },
            {$project: {_id: 0, sizeUnit: "$_id", sizes: 1}}
        ]);
        res.status(200).json(sizeUnits);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};


module.exports = {
    addProductSize,
    getProductSize,
    updateProductSize,
    deleteProductSize,
    getSizeUnitsWithSizes
}