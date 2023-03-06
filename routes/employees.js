const express = require('express');
const router = express.Router();

const ROLES_LIST = require('../config/roles-list');
const verifyRoles = require('../middleware/verifyRoles');

const employeesController = require('../controllers/employees');

router
  .route('/')
  .get(employeesController.getEmployees)
  .post(
    verifyRoles(ROLES_LIST.admin, ROLES_LIST.editor),
    employeesController.createEmployee
  );

router
  .route('/:id')
  .get(employeesController.getEmployee)
  .patch(
    verifyRoles(ROLES_LIST.admin, ROLES_LIST.editor),
    employeesController.updateEmployee
  )
  .delete(verifyRoles(ROLES_LIST.admin), employeesController.deleteEmployee);

module.exports = router;
