const multer = require('multer');
const path = require('path');
const ProductModel = require('../../models/ProductModel');
const jwt = require('jsonwebtoken');
const AdminAuthModel = require('../../models/AdminModels/AdminAuthModel');
const { getInventoryReport } = require('./AdminReportController');
const WorkinProgressProductModel = require('../../models/WorkinProgressProductModel');
const upload = require('../../helpers/MulterConfig');

// //set up storage engine
// const storage = multer.diskStorage({
//     destination: function(req, file, cb){
//         cb(null, 'uploads/products');
//     },
//     // filename: function(req, file, cb){
//     //     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     // }
//     filename: function(req, file, cb){
//         const uniqueSuffix = '-' + Date.now() + path.extname(file.originalname);
//         cb(null, file.originalname.replace(path.extname(file.originalname), '') + uniqueSuffix);
//     }
// });

// //initialize upload
// const upload = multer({
//     storage: storage,
//     limits: {fileSize: 5 * 1024 * 1024},
//     fileFilter: function(req, file, cb){
//         checkFileType(file, cb);
//     }
// }).single('image');

// //check file type
// function checkFileType(file, cb){
//     const filetypes = /jpeg|jpg|png/;
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = filetypes.test(file.mimetype);

//     if(mimetype && extname){
//         return cb(null, true);
//     } else{
//         cb('Error: Images Only!');
//     }
// }


const uploadProductAdmin = async(req, res) => {
    upload(req, res, async (err) => {
        if(err){
            return res.json({error: err});
        }

        try {
            const {
                productCode, productName, category, price, quantity, stockLevel,
                discountPercentage = 0, discountedDate, sizeUnit, productSize,
                expirationDate, description
            } = req.body;

            const imageUrl = req.file ? req.file.path : '';

            if(!productCode || !productName || !category || !price || !quantity || !stockLevel || !imageUrl || !productSize || !expirationDate){
                return res.json({
                    error: 'Please provide all required fields'
                });
            }

            if(discountedDate && new Date(discountedDate) < new Date()) {
                return res.json({ 
                    error: 'Discounted date must be today or a future date.' 
                });
            }

            const token = req.cookies.token;
            if(!token){
                return res.json({ 
                    error: 'Unauthorized - Missing token' 
                });
            }

            jwt.verify(token, process.env.JWT_SECRET, {}, async(err, decodedToken) => {
                if(err){
                    return res.json({ 
                        error: 'Unauthorized - Invalid token' 
                    });
                }

                const adminId = decodedToken.id;
                const adminExists = await AdminAuthModel.findById(adminId);
                if(!adminExists){
                    return res.json({ 
                        error: 'Admin does not exist' 
                    });
                }

                //check for existing products with the same expirationDate
                const existingBatch = await ProductModel.findOne({
                    expirationDate,
                });

                //determine batch based on existing batch or create a new one
                const batch = existingBatch
                    ? `Batch ${existingBatch.batch.split(' ')[1]}` //same batch if expirationDate matches
                    : `Batch ${await ProductModel.countDocuments() + 1}`; //new batch if no match

                const discountedPrice = discountPercentage > 0
                    ? price - (price * discountPercentage) / 100
                    : price;

                //create new product with the determined batch
                const newProduct = await ProductModel.create({
                    productCode,
                    productName,
                    category,
                    price,
                    discountedPrice,
                    discountPercentage,
                    quantity,
                    stockLevel,
                    discountedDate,
                    imageUrl,
                    sizeUnit,
                    productSize,
                    uploaderId: adminId,
                    uploaderType: 'Admin',
                    expirationDate,
                    description,
                    createdBy: adminExists.fullName,
                    batch,
                });
                
                await getInventoryReport(
                    newProduct._id,
                    newProduct.productName,
                    newProduct.sizeUnit,
                    newProduct.productSize,
                    newProduct.category,
                    newProduct.quantity,
                    true
                );
                

                return res.json({
                    message: 'Product added successfully!',
                    newProduct,
                });
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ 
                message: 'Server error' 
            });
        }
    });
};



const getProductAdmin = async(req, res) => {
    try {
        const adminProducts = await ProductModel.find();
        return res.json(adminProducts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
}
const getBatchProductAdmin = async(req, res) => {
    try {
        const {batch} = req.query;
        if(!batch){
            return res.status(400).json({ 
                error: 'Batch is required' 
            });
        }

        const batchProducts = await ProductModel.find({batch});
        return res.json(batchProducts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
};



const deleteProductAdmin = async(req, res) => {
    try {
        const product = await ProductModel.findById(req.params.productId);
        if(!product){
            return res.status(404).json({ 
                message: 'Product not found' 
            });
        }

        await ProductModel.findByIdAndDelete(req.params.productId);

        return res.status(200).json({ 
            message: 'Product deleted successfully' 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
};



// const editProductAdmin = async(req, res) => {
//     upload(req, res, async(err) => {
//         if(err){
//             return res.json({error: err});
//         }

//         try {
//             const {productId} = req.params;
//             const {
//                 productCode, 
//                 productName, 
//                 category, 
//                 price, 
//                 quantity, 
//                 stockLevel, 
//                 discountPercentage = 0, 
//                 discountedDate, 
//                 sizeUnit, 
//                 productSize, 
//                 expirationDate,
//                 description,
//                 refillPrice
//             } = req.body;
//             const imageUrl = req.file ? req.file.path : '';

//             if(!productCode || !productName || !category || !price || !stockLevel || !productSize || !expirationDate){
//                 return res.json({
//                     error: 'Please provide all required fields'
//                 });
//             }

//             const product = await ProductModel.findById(productId);
//             if(!product){
//                 return res.json({
//                     error: 'Product not found'
//                 });
//             }

//             // //calculate discountedPrice
//             // const discountedPrice = price - (price * discountPercentage / 100);
//             const currentDate = new Date();
//             let discountedPrice = price;

//             if(discountPercentage > 0 && discountedDate && new Date(discountedDate) > currentDate){
//                 discountedPrice = price - (price * discountPercentage / 100);
//             } else{
//                 //reset discount if expired or invalid
//                 product.discountPercentage = 0;
//                 product.discountedDate = null;
//             }
 

//             //update product fields
//             product.productCode = productCode;
//             product.productName = productName;
//             product.category = category;
//             product.price = price;
//             product.discountedPrice = discountedPrice;
//             product.quantity = quantity;
//             product.stockLevel = stockLevel;
//             product.discountPercentage = discountPercentage;
//             product.sizeUnit = sizeUnit;
//             product.productSize = productSize;
//             product.expirationDate = expirationDate;
//             product.discountedDate = discountedDate;
//             product.description = description;
//             product.refillPrice = refillPrice;
//             if(imageUrl){
//                 product.imageUrl = imageUrl;
//             }

//             const updatedProduct = await product.save();


//             await getInventoryReport(product._id, productName, sizeUnit, productSize, category, quantity);


//             return res.json({
//                 message: 'Product updated successfully!',
//                 updatedProduct
//             });
//         } catch (error) {
//             console.error(error);
//             return res.status(500).json({
//                 message: 'Server error'
//             });
//         }
//     });
// };
//updated
const editProductAdmin = async(req, res) => {
    upload(req, res, async (err) => {
        if(err){
            return res.json({error: err});
        }

        try {
            const {productId} = req.params;
            const {
                productCode, 
                productName, 
                category, 
                price, 
                quantity, 
                stockLevel, 
                discountPercentage = 0, 
                discountedDate, 
                sizeUnit, 
                productSize, 
                expirationDate,
                description
            } = req.body;
            const imageUrl = req.file ? req.file.path : '';

            if(!productCode || !productName || !category || !price || !stockLevel || !productSize || !expirationDate){
                return res.json({
                    error: 'Please provide all required fields'
                });
            }

            const product = await ProductModel.findById(productId);
            if(!product){
                return res.json({
                    error: 'Product not found'
                });
            }

            //check if expirationDate has changed
            let batch;
            if(expirationDate !== product.expirationDate){
                //if expirationDate changed, check for an existing product with the same expirationDate
                const existingBatch = await ProductModel.findOne({ expirationDate });

                //assign the existing batch or create a new batch
                batch = existingBatch ? `Batch ${existingBatch.batch.split(' ')[1]}` : `Batch ${await ProductModel.countDocuments() + 1}`;
            } else{
                //if expirationDate didn't change, keep the existing batch
                batch = product.batch;
            }

            //calculate discounted price
            const currentDate = new Date();
            let discountedPrice = price;

            if(discountPercentage > 0 && discountedDate && new Date(discountedDate) > currentDate){
                discountedPrice = price - (price * discountPercentage / 100);
            } else{
                //reset discount if expired or invalid
                product.discountPercentage = 0;
                product.discountedDate = null;
            }

            //udate product fields
            product.productCode = productCode;
            product.productName = productName;
            product.category = category;
            product.price = price;
            product.discountedPrice = discountedPrice;
            product.quantity = !isNaN(quantity) ? Number(quantity) : 0;
            product.stockLevel = stockLevel;
            product.discountPercentage = discountPercentage;
            product.sizeUnit = sizeUnit;
            product.productSize = productSize;
            product.expirationDate = expirationDate;
            product.discountedDate = discountedDate;
            product.description = description;
            product.batch = batch;
            if(imageUrl){
                product.imageUrl = imageUrl;
            }

            const updatedProduct = await product.save();

            await getInventoryReport(product._id, productName, sizeUnit, productSize, category, quantity);

            return res.json({
                message: 'Product updated successfully!',
                updatedProduct
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: 'Server error'
            });
        }
    });
};



const getEditProductAdmin = async(req, res) => {
    const {productId} = req.params;
    try {
        const product = await ProductModel.findById(productId);
        if(!product){
            return res.status(404).json({ 
                message: 'Product not found'
            });
        }
        res.json(product);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
};



// const getStatisticsAdmin = async(req, res) => {
//     try {
//         //count distinct categories
//         const categoryCount = await ProductModel.distinct('category').countDocuments();

//         //count total products
//         const totalProducts = await ProductModel.countDocuments();

//         //sum of all units produced (quantity field)
//         const totalUnitsProduced = await ProductModel.aggregate([
//             {$group: {_id: null, totalQuantity: {$sum: '$quantity'}}}
//         ]);

//         //count of low stock items (quantity < 10)
//         const lowStockCount = await ProductModel.countDocuments({quantity: {$lt: 10}});

//         res.json({
//             categoryCount,
//             totalProducts,
//             totalUnitsProduced: totalUnitsProduced[0]?.totalQuantity || 0,
//             lowStockCount
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             message: 'Server error'
//         });
//     }
// };
const getProductSummaryAdmin = async(req, res) => {
    try {

        //get the count of unique categories
        const categories = await ProductModel.distinct('category');
        const categoryCount = categories.length;

        //get the total number of products
        const totalProducts = await ProductModel.countDocuments();

        //calculate the total value (sum of price * quantity for each product)
        const totalValueResult = await ProductModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalValue: {$sum: {$multiply: ['$price', '$quantity']}}
                }
            }
        ]);
        const totalValue = totalValueResult[0]?.totalValue || 0;

        //get the total units produced (sum of all product quantities)
        const totalUnitsProduced = await ProductModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalQuantity: {$sum: '$quantity'}
                }
            }
        ]);

        //get the count of products with low stock (quantity < 10)
        const lowStockCount = await ProductModel.countDocuments({quantity: {$lt: 10}});
        const notInStock = await ProductModel.countDocuments({quantity: 0});

        res.json({
            categoryCount,
            totalProducts,
            totalUnitsProduced: totalUnitsProduced[0]?.totalQuantity || 0,
            totalValue,
            lowStockCount,
            notInStock
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Server error' 
        });
    }
};

//to get or notify the low quantity of product.
const getOutOfStockProductsAdmin = async(req, res) => {
    try {
        //fetch all products
        const products = await ProductModel.find();

        //filter the products where quantity < stockLevel
        const outOfStockProducts = products.filter(product => product.quantity < product.stockLevel);

        return res.json(outOfStockProducts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
};

const getUniqueCategoriesAdmin = async(req, res) => {
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

const getProductsAdmin = async (req, res) => {
    const category = req.query.category;

    try {
        const query = {
            ...(category ? {category: category} : {}),
            isArchived: false,
        };

        //fetch all products from ProductModel
        const customerProducts = await ProductModel.find(query);

        //fetch all products from WorkinProgressProductModel
        const workinProgressProducts = await WorkinProgressProductModel.find(query);

        //combine both product lists
        const allProducts = [...customerProducts, ...workinProgressProducts];

        //group by productName and prioritize by sizeUnit and productSize
        const productMap = new Map();

        allProducts.forEach(product => {
            const key = product.productName;

            if(!productMap.has(key)){
                productMap.set(key, product);
            } else{
                const existingProduct = productMap.get(key);

                const sizePriority = {
                    'Gallons': 3,
                    'Liters': 2,
                    'Milliliters': 1,
                };

                const existingSizePriority = sizePriority[existingProduct.sizeUnit] || 0;
                const newSizePriority = sizePriority[product.sizeUnit] || 0;

                if(
                    newSizePriority > existingSizePriority ||
                    (newSizePriority === existingSizePriority && product.productSize > existingProduct.productSize)
                ){
                    productMap.set(key, product);
                }
            }
        });

        const prioritizedProducts = Array.from(productMap.values());

        return res.json(prioritizedProducts);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Server error',
        });
    }
};


module.exports = {
    uploadProductAdmin,
    getProductAdmin,
    deleteProductAdmin,
    editProductAdmin,
    getEditProductAdmin,
    // getStatisticsAdmin,
    getProductSummaryAdmin,
    getOutOfStockProductsAdmin,
    getUniqueCategoriesAdmin,
    getProductsAdmin,
    getBatchProductAdmin
}
