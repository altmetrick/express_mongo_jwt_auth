const express = require('express');
const router = express.Router();

const employeesControllers = require('../controllers/employees');

router
  .route('/')
  .get(employeesControllers.getEmployees)
  .post(employeesControllers.createEmployee);

router
  .route('/:id')
  .get(employeesControllers.getEmployee)
  .put(employeesControllers.updateEmployee)
  .delete(employeesControllers.deleteEmployee);

module.exports = router;
