const express = require('express');
const router = express.Router();

const ROLES_LIST = require('../config/roles-list');
const verifyRoles = require('../middleware/verifyRoles');

const employeesControllers = require('../controllers/employees');

router
  .route('/')
  .get(employeesControllers.getEmployees)
  .post(
    verifyRoles(ROLES_LIST.admin, ROLES_LIST.editor),
    employeesControllers.createEmployee
  );

router
  .route('/:id')
  .get(employeesControllers.getEmployee)
  .put(
    verifyRoles(ROLES_LIST.admin, ROLES_LIST.editor),
    employeesControllers.updateEmployee
  )
  .delete(verifyRoles(ROLES_LIST.admin), employeesControllers.deleteEmployee);

module.exports = router;
