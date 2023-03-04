const express = require('express');
const router = express.Router();
const logOutController = require('../controllers/logout');

router.get('/', logOutController.handleLogOut);

module.exports = router;
