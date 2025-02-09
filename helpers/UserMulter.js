const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../helpers/CloudinaryConfig');

//set up Cloudinary storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'profilePictures/users', //store inside Cloudinary folder
        resource_type: 'image',
        format: async (req, file) => 'png', //convert all images to PNG
        public_id: (req, file) => file.originalname.split('.')[0] + '-' + Date.now(),
    },
});

//initialize multer
const uploadUser = multer({
    storage: storage,
    limits: {fileSize: 5 * 1024 * 1024}, //5MB file size limit
    fileFilter: function (req, file, cb){
        checkFileType(file, cb);
    },
}).single('profilePicture');

//function to check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(file.originalname.toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    } else{
        cb(new Error('Error: Images Only!'));
    }
}

module.exports = uploadUser;
