const exppress = require('express');
const { addUserAccount, updateUserAccount, deleteUserAccount, getUserAccount } = require("../../controllers/AdminControllers/AdminUsersController");

const router = exppress.Router();

router.post('/addUserAccount', addUserAccount);
router.put('/updateUserAccount/:id', updateUserAccount);
router.delete('/deleteUserAccount/:id', deleteUserAccount);
router.get('/getUserAccount', getUserAccount);

module.exports = router;