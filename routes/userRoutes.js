const express = require('express');
const router = express.Router();
const { getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword } = require('../controllers/userController'); // Updated here

router.route('/').get(getAllUsers);

router.route('/showMe').get(showCurrentUser);
router.route('/updateUser').post(updateUser);
router.route('/updateUserPass').post(updateUserPassword); // Updated here
router.route('/:id').get(getSingleUser);

module.exports = router;
