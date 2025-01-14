const ProductModel = require("../../models/ProductModel");


// const getProductCustomer = async (req, res) => {
//     const category = req.query.category;

//     try {
//         const query = {
//             ...(category ? {category: category} : {}),
//             isArchived: false,
//         };

//         //fetch all products that match the query without stock checks
//         const customerProducts = await ProductModel.find(query);

//         //group by productName and prioritize by sizeUnit and productSize
//         const productMap = new Map();

//         customerProducts.forEach(product => {
//             const key = product.productName;

//             if(!productMap.has(key)){
//                 productMap.set(key, product);
//             } else{
//                 const existingProduct = productMap.get(key);

//                 const sizePriority = {
//                     'Gallons': 3,
//                     'Liters': 2,
//                     'Milliliters': 1,
//                 };

//                 const existingSizePriority = sizePriority[existingProduct.sizeUnit] || 0;
//                 const newSizePriority = sizePriority[product.sizeUnit] || 0;

//                 if(
//                     newSizePriority > existingSizePriority ||
//                     (newSizePriority === existingSizePriority && product.productSize > existingProduct.productSize)
//                 ){
//                     productMap.set(key, product);
//                 }
//             }
//         });

//         const prioritizedProducts = Array.from(productMap.values());

//         return res.json(prioritizedProducts);
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message: 'Server error',
//         });
//     }
// };

// const getProductCustomer = async(req, res) => {
//     try {
//         const {sizeUnit, category} = req.query;
//         const query = {};
//         if(sizeUnit) query.sizeUnit = sizeUnit;
//         if(category) query.category = category;

//         const products = await ProductModel.find(query);
//         res.status(200).json(products);
//     } catch (err) {
//         res.status(500).json({ 
//             message: 'Error fetching products', error: err.message 
//         });
//     }
// };

const getProductCustomer = async(req, res) => {
    try {
        const {sizeUnit, category} = req.query;
        const query = {};

        //add filters based on the query parameters
        if(sizeUnit) query.sizeUnit = sizeUnit;
        if(category) query.category = category;

        //fetch the products based on the query
        const products = await ProductModel.find(query)
            .sort({batch: 1}) //ensure the products are sorted by batch number
            .collation({locale: 'en', numericOrdering: true}); //handle numerical sorting of batch numbers

        //to prevent duplication of productName with different batches, group by productName
        const groupedProducts = products.reduce((acc, product) => {
            //group by productName, sizeUnit, and productSize
            const key = `${product.productName}_${product.sizeUnit}_${product.productSize}`;
            if (!acc[key]) {
                acc[key] = product; //keep the first instance of the product in the batch order
            }
            return acc;
        }, {});

        //rturn the unique products (removing duplicates)
        const uniqueProducts = Object.values(groupedProducts);

        res.status(200).json(uniqueProducts);
    } catch (err) {
        res.status(500).json({
            message: 'Error fetching products', error: err.message
        });
    }
};


// const getProductDetailsCustomer = async(req, res) => {
//     const productId = req.params.productId;

//     try {
//         const productDetails = await ProductModel.findById(productId);
//         if(!productDetails){
//             return res.status(404).json({ 
//                 error: 'Product not found.' 
//             });
//         }

//         //get all products with the same productName to fetch available sizes and units
//         const relatedProducts = await ProductModel.find({productName: productDetails.productName});

//         //extract available sizes and units
//         const sizesAndUnits = relatedProducts.map(product => ({
//             sizeUnit: product.sizeUnit,
//             productSize: product.productSize,
//             productId: product._id
//         }));

//         //find related products (based on category)
//         const moreRelatedProducts = await ProductModel.find({
//             _id: {$ne: productId},  //exclude the current product
//             category: productDetails.category //filter by the same category
//         }).limit(5);

//         return res.json({
//             ...productDetails.toObject(),
//             sizesAndUnits: sizesAndUnits,
//             relatedProducts: moreRelatedProducts //iclude related products based on category
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ 
//             message: 'Server error' 
//         });
//     }
// };
const getProductDetailsCustomer = async(req, res) => {
    const productId = req.params.productId;

    try {
        const productDetails = await ProductModel.findById(productId);
        if(!productDetails){
            return res.status(404).json({
                error: 'Product not found.'
            });
        }

        //get all products with the same productName to fetch available sizes and units
        const relatedProducts = await ProductModel.find({productName: productDetails.productName});

        //extract available sizes and units, ensuring uniqueness
        const sizesAndUnits = relatedProducts.reduce((acc, product) => {
            const key = `${product.sizeUnit}_${product.productSize}`;
            if(!acc[key]){
                acc[key] = {
                    sizeUnit: product.sizeUnit,
                    productSize: product.productSize,
                    productId: product._id
                };
            }
            return acc;
        }, {});

        //convert the grouped sizesAndUnits object back into an array
        const uniqueSizesAndUnits = Object.values(sizesAndUnits);

        //find related products (based on category), excluding the current product
        const moreRelatedProducts = await ProductModel.find({
            _id: {$ne: productId},  //exclude the current product
            category: productDetails.category //filter by the same category
        }).limit(5);

        return res.json({
            ...productDetails.toObject(),
            sizesAndUnits: uniqueSizesAndUnits, //send only unique sizeUnit and productSize
            relatedProducts: moreRelatedProducts //include related products based on category
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Server error'
        });
    }
};

const getUniqueCategoriesCustomer = async(req, res) => {
    try {
        const categories = await ProductModel.distinct('category');
        return res.json(categories);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
};

module.exports = {
    getProductCustomer,
    getProductDetailsCustomer,
    getUniqueCategoriesCustomer
}