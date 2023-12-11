const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  dateOfJoining: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  employeeType: {
    type: String,
    required: true,
  },
  currentStatus: {
    type: String,
    required: true,
  },
});

const Employee = mongoose.model('employee', employeeSchema);
module.exports = Employee;
