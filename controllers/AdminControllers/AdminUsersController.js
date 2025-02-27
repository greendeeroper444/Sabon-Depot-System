const { hashPassword } = require('../../helpers/HashedAndComparedPassword');
const StaffAuthModel = require('../../models/StaffModels/StaffAuthModel');
const AdminAuthModel = require('../../models/AdminModels/AdminAuthModel');
const CustomerAuthModel = require('../../models/CustomerModels/CustomerAuthModel');

const addUserAccount = async(req, res) => {
    try {
        const {userType, fullName, firstName, lastName, middleInitial, emailAddress, contactNumber, password, clientType, gender, address, province, city, barangay, purokStreetSubdivision} = req.body;

        if(!userType || !['Staff', 'Admin', 'Customer'].includes(userType)){
            return res.status(400).json({ 
                message: 'Invalid user type' 
            });
        }

        if(!password){
            return res.status(400).json({ 
                message: 'Password is required' 
            });
        }

        const hashedPassword = await hashPassword(password);

        let newUser;

        if(userType === 'Staff'){
            newUser = new StaffAuthModel({ fullName, emailAddress, contactNumber, password: hashedPassword, gender, address });
        } else if(userType === 'Admin'){
            newUser = new AdminAuthModel({ fullName, emailAddress, contactNumber, password: hashedPassword, gender, address });
        } else if(userType === 'Customer'){
            if(!clientType || !['Individual', 'Wholesaler'].includes(clientType)){
                return res.status(400).json({ 
                    message: 'Invalid client type for customer' 
                });
            }
            newUser = new CustomerAuthModel({
                firstName,
                lastName,
                middleInitial,
                emailAddress,
                contactNumber,
                password: hashedPassword,
                clientType,
                gender,
                province,
                city,
                barangay,
                purokStreetSubdivision,
            });
        }

        await newUser.save();
        res.status(201).json({ 
            message: `${userType} account created successfully` 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error adding user account', error 
        });
    }
};

//update user account
// const updateUserAccount = async(req, res) => {
//     try {
//         const {id} = req.params;
//         const {userType, fullName, firstName, lastName, middleInitial, emailAddress, contactNumber, clientType, gender, address, province, city, barangay, purokStreetSubdivision} = req.body;

//         if(!userType || !['Staff', 'Admin', 'Customer'].includes(userType)){
//             return res.status(400).json({ message: 'Invalid user type' });
//         }

//         let updateData;

//         if(userType === 'Staff'){
//             updateData = {fullName, emailAddress, contactNumber, gender, address};
//         } else if(userType === 'Admin'){
//             updateData = {fullName, emailAddress, contactNumber, gender, address};
//         } else if(userType === 'Customer'){
//             if(!clientType || !['Individual', 'Wholesaler'].includes(clientType)){
//                 return res.status(400).json({ 
//                     message: 'Invalid client type for customer'
//                 });
//             }
//             updateData = {
//                 firstName,
//                 lastName,
//                 middleInitial,
//                 emailAddress,
//                 contactNumber,
//                 clientType,
//                 gender,
//                 province,
//                 city,
//                 barangay,
//                 purokStreetSubdivision,
//             };
//         }

//         const model = userType === 'Staff' ? StaffAuthModel : userType === 'Admin' ? AdminAuthModel : CustomerAuthModel;
//         await model.findByIdAndUpdate(id, updateData);
//         res.status(200).json({ 
//             message: `${userType} account updated successfully` 
//         });
//     } catch (error) {
//         res.status(500).json({ 
//             message: 'Error updating user account', 
//             error 
//         });
//     }
// };
const updateUserAccount = async (req, res) => {
    try {
        const {id} = req.params;
        const { 
            userType, fullName, firstName, lastName, middleInitial, emailAddress, 
            contactNumber, clientType, gender, address, province, city, barangay, 
            purokStreetSubdivision, password 
        } = req.body;

        if(!userType || !['Staff', 'Admin', 'Customer'].includes(userType)){
            return res.status(400).json({ 
                message: 'Invalid user type' 
            });
        }

        let updateData = {};

        if(userType === 'Staff' || userType === 'Admin'){
            updateData = { fullName, emailAddress, contactNumber, gender, address };
        } else if(userType === 'Customer'){
            if(!clientType || !['Individual', 'Wholesaler'].includes(clientType)){
                return res.status(400).json({ 
                    message: 'Invalid client type for customer' 
                });
            }
            updateData = {
                firstName, lastName, middleInitial, emailAddress, contactNumber,
                clientType, gender, province, city, barangay, purokStreetSubdivision
            };
        }

        //if a new password is provided, hash it and add it to updateData
        if(password && password.trim() !== ''){
            updateData.password = await hashPassword(password);
        }

        //select the correct model based on userType
        const model = userType === 'Staff' ? StaffAuthModel : 
        userType === 'Admin' ? AdminAuthModel : CustomerAuthModel;

        const updatedUser = await model.findByIdAndUpdate(id, updateData, {new: true});

        if(!updatedUser){
            return res.status(404).json({ 
                message: `${userType} account not found` 
            });
        }

        res.status(200).json({ 
            message: `${userType} account updated successfully` 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error updating user account', error: error.message 
        });
    }
};

//delete user account
const deleteUserAccount = async(req, res) => {
    try {
        const {id} = req.params;
        const {userType} = req.body;

        if(!userType || !['Staff', 'Admin', 'Customer'].includes(userType)){
            return res.status(400).json({ 
                message: 'Invalid user type' 
            });
        }

        const model = userType === 'Staff' ? StaffAuthModel : userType === 'Admin' ? AdminAuthModel : CustomerAuthModel;
        await model.findByIdAndDelete(id);
        res.status(200).json({ 
            message: `${userType} account deleted successfully` 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error deleting user account', 
            error 
        });
    }
};

//get user acc
const getUserAccount = async(req, res) => {
    try {
        const {userType} = req.query;

        if(!userType || !['Staff', 'Admin', 'Customer'].includes(userType)){
            return res.status(400).json({ 
                message: 'Invalid user type' 
            });
        }

        const model = userType === 'Staff' ? StaffAuthModel : userType === 'Admin' ? AdminAuthModel : CustomerAuthModel;
        const users = await model.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching user accounts', 
            error 
        });
    }
};

module.exports = {
    addUserAccount,
    updateUserAccount,
    deleteUserAccount,
    getUserAccount,
};
