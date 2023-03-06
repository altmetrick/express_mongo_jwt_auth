const express = require('express');
const router = express.Router();

const ROLES_LIST = require('../config/roles-list');
const verifyRoles = require('../middleware/verifyRoles');

const usersController = require('../controllers/users');

router
  .route('/')
  .get(verifyRoles(ROLES_LIST.admin), usersController.getAllUsers);

router
  .route('/:id')
  .get(verifyRoles(ROLES_LIST.admin), usersController.getUser)
  .patch(verifyRoles(ROLES_LIST.admin), usersController.updateUser)
  .delete(verifyRoles(ROLES_LIST.admin), usersController.deleteUser);

module.exports = router;
