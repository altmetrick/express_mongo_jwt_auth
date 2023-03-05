const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name must be provided'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name must be provided'],
    trim: true,
  },
});

const EmployeeModel = mongoose.model('Employee', EmployeeSchema);

module.exports = EmployeeModel;
