const data = {};
data.employees = require('../models/employees.json');

const getEmployees = (req, res) => {
  res.json(data.employees);
};

const createEmployee = (req, res) => {
  const { firstName, lastName } = req.body;

  if (!firstName || !lastName) {
    return res
      .status(400)
      .json({ message: 'First and last names are required' });
  }

  const lastItemIndex = data.employees.length - 1;
  const id = data.employees[lastItemIndex].id + 1 || 1;

  const employee = { id, firstName, lastName };
  data.employees.push(employee);

  res.status(200).json(employee);
};

const getEmployee = (req, res) => {
  const { id } = req.params;

  const employee = data.employees.find((e) => e.id === Number(id));

  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee with id: ${id} not found` });
  }

  res.status(200).json(employee);
};

const updateEmployee = (req, res) => {
  const { id } = req.params;
  const { firstName, lastName } = req.body;

  if (!firstName || !lastName) {
    return res
      .status(400)
      .json({ message: 'First and last names are required' });
  }

  const employee = data.employees.find((e) => e.id === Number(id));

  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee with id: ${id} not found` });
  }

  data.employees = data.employees.map((e) => {
    if (e.id === Number(id)) {
      return { ...e, firstName, lastName };
    }
    return e;
  });

  res.status(200).json({ firstName, lastName });
};

const deleteEmployee = (req, res) => {
  const { id } = req.params;

  const employee = data.employees.find((e) => e.id === Number(id));

  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee with id: ${id} not found` });
  }

  data.employees = data.employees.filter((e) => e.id !== Number(id));
  res.status(200).json({ message: `Employee with id: ${id} was deleted` });
};

module.exports = {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
