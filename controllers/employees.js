const Employee = require('../models/Employee');

const asyncWrapper = require('../middleware/async-wrapper');

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({});
    if (!employees) {
      //204 - no content
      return res.status(204).json({ message: 'No employees found.' });
    }
    res.status(200).json(employees);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

const createEmployee = async (req, res) => {
  const { firstName, lastName } = req.body;

  if (!firstName || !lastName) {
    return res
      .status(400)
      .json({ message: 'First and last names are required' });
  }

  try {
    //Creating and storing an employee
    const employee = await Employee.create({ firstName, lastName });

    res.status(200).json({ employee });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

const getEmployee = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const employee = await Employee.findOne({ _id: id }).exec();

  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee with id: ${id} not found` });
  }

  res.status(200).json(employee);
});

const updateEmployee = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName } = req.body;

  if (!firstName || !lastName) {
    return res
      .status(400)
      .json({ message: 'First and last names are required' });
  }

  const employee = await Employee.findOneAndUpdate(
    { _id: id },
    { firstName, lastName }
  );

  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee with id: ${id} not found` });
  }

  res.status(200).json({ employee, message: 'Employee updated' });
});

const deleteEmployee = asyncWrapper(async (req, res) => {
  const { id } = req.params;

  const employee = await Employee.findOneAndDelete({ _id: id }).exec();

  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee with id: ${id} not found` });
  }

  res.status(200).json({ message: `Employee with id: ${id} was deleted` });
});

module.exports = {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
