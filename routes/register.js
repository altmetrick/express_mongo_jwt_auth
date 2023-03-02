const express = require('express');
const router = express.Router();
const registerUserController = require('../controllers/register');

router.route('/').post(registerUserController.registerUser);

module.exports = router;
