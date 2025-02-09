const jwt = require('jsonwebtoken');
const { comparePassword } = require('../../helpers/HashedAndComparedPassword');
const AdminAuthModel = require('../../models/AdminModels/AdminAuthModel');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const uploadUser = require('../../helpers/UserMulter');

// //set up storage engine
// const storage = multer.diskStorage({
//     destination: function(req, file, cb){
//         cb(null, 'uploads/profilePictures/admins');
//     },
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
// }).single('profilePicture');

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


// const loginAdmin = async(req, res) => {
//     try {
//         const {fullName, password} = req.body;

//         const admin = await AdminAuthModel.findOne({fullName});
//         if(!admin){
//             return res.status(400).json({
//                 error: 'No admin exist'
//             })
//         };

//         const correctPassword = await comparePassword(password, admin.password);
//         if(correctPassword){
//             jwt.sign({
//                 id: admin._id,
//                 fullName: admin.fullName,
//                 emailAddress: admin.emailAddress
//             }, process.env.JWT_SECRET, {}, (error, token) => {
//                 if(error) throw error
//                res.cookie('token', token, {httpOnly: true})
//                 res.json({
//                     admin,
//                     token,
//                     message: `Hi ${admin.fullName.split(' ')[0]}, welcome back!!!`
//                 })
//             })
//         };

//         if(!correctPassword){
//             return res.json({
//                 error: 'Password don\'t match!'
//             })
//         };

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ 
//             message: 'Server error' 
//         });
//     }
// }
const loginAdmin = async(req, res) => {
    try {
        const {fullName, password} = req.body;

        const admin = await AdminAuthModel.findOne({fullName});
        if(!admin){
            return res.status(400).json({
                error: 'No admin exist'
            })
        };

        const correctPassword = await comparePassword(password, admin.password);
        if(correctPassword){
            jwt.sign({
                id: admin._id.toString(),
                profilePicture: admin.profilePicture,
                fullName: admin.fullName,
                nickName: admin.nickName,
                address: admin.address,
                contact: admin.contactNumber,
                genter: admin.gender,
                emailAddress: admin.emailAddress
            }, process.env.JWT_SECRET, {}, (error, token) => {
                if(error) throw error;
                res.cookie('token', token, {httpOnly: true, secure: process.env.NODE_ENV === 'production'});
                res.json({
                    admin,
                    token,
                    message: 'Sign in successfully'
                });
            });
            
        };

        if(!correctPassword){
            return res.json({
                error: 'Password don\'t match!'
            })
        };

    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
};

const logoutAdmin = (req, res) => {
    res.clearCookie('token');
    req.session.destroy((err) => {
        if(err){
            return res.status(500).json({ 
                error: 'Failed to log out' 
            });
        } res.status(200).json({ 
            message: 'Logged out successfully' 
        });
    });
};


const getDataAdmin = (req, res) => {
    const token = req.cookies.token;

    if(token){
        jwt.verify(token, process.env.JWT_SECRET, (error, decodedToken) => {
            if(error){
                console.error(error);
                return res.status(401).json({ 
                    error: 'Invalid token' 
                });
            }

            const adminId = decodedToken.id;

            if(!mongoose.Types.ObjectId.isValid(adminId)){
                return res.status(400).json({ 
                    error: 'Invalid Admin ID' 
                });
            }

            //if the ID is valid, proceed to fetch the admin data from the database
            AdminAuthModel.findById(adminId)
                .then(admin => {
                    if(!admin){
                        return res.status(404).json({ 
                            error: 'Admin not found' 
                        });
                    }
                    return res.json(admin);
                })
                .catch(err => {
                    console.error(err);
                    return res.status(500).json({ 
                        message: 'Server error' 
                    });
                });
        });
    } else {
        return res.status(404).json({ 
            error: 'No token found' 
        });
    }
};

const updateProfileAdmin = async(req, res) => {
    uploadUser(req, res, async(err) => {
        if(err){
            return res.status(400).json({error: err.message});
        }
        
        try {

            const adminId = req.params.adminId;
            const {fullName, nickName, gender, contactNumber, address} = req.body;
            
            if(!adminId){
                return res.status(400).json({ 
                    message: 'Admin ID is required' 
                });
            }
            
            let profilePictureUrl = '';
            if(req.file){
                profilePictureUrl = req.file.path.replace(/\\/g, '/');
            }
            
            const updatedAdmin = await AdminAuthModel.findByIdAndUpdate(
                adminId,
                {
                    fullName,
                    nickName,
                    gender,
                    contactNumber,
                    address,
                    profilePicture: profilePictureUrl || undefined
                },
                {new: true, runValidators: true}
            );
            
            if(!updatedAdmin){
                return res.status(404).json({ 
                    message: 'Admin not found' 
                });
            }
            
            res.status(200).json({
                message: 'Admin profile updated successfully',
                admin: updatedAdmin
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ 
                message: 'Internal server error' 
            });
        }
    });
};
const getDataUpdateAdmin = async(req, res) => {
    try {
        // const {adminId} = req.params;
        const adminId = req.params.adminId;
        if(!adminId){
            return res.status(400).json({ 
                message: 'Admin ID is required' 
            });
        }

        const admin = await AdminAuthModel.findById(adminId);

        if(!admin){
            return res.status(404).json({ 
                message: 'Admin not found' 
            });
        }

        res.status(200).json({
            message: 'Admin data retrieved successfully',
            admin
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Internal server error' 
        });
    }
};


module.exports = {
    loginAdmin,
    logoutAdmin,
    getDataAdmin,
    updateProfileAdmin,
    getDataUpdateAdmin
}