const mongoose = require('mongoose');
const Employee = require('../models/employee');

const db_url = 'mongodb+srv://zaidalam0731:zaid@cluster0.s71ckpw.mongodb.net/EmployeeManagementSystem?retryWrites=true&w=majority';

async function ConnectTodb() {
  try {
    await mongoose.connect(db_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to the Database');
  } catch (connErr) {
    console.error(connErr);
  }
}

async function getEmployeesList() {
  try {
    const employees = await Employee.find();
    return employees;
  } catch (error) {
    console.error(error);
  }
}

async function getEmployeesListFilter(filter) {
  try {
    const employees = await Employee.find(filter);
    return employees;
  } catch (error) {
    console.error(error);
  }
}

async function addEmployee(emp) {
  try {
    const savedEmployee = await Employee.create(emp);
    return savedEmployee;
  } catch (error) {
    console.error(error);
  }
}

async function getEmployeeDetails(id) {
  try {
    const employee = await Employee.findOne({ _id: id });
    return employee;
  } catch (error) {
    console.error(error);
  }
}

async function updateEmployee(id, input) {
  try {
    const updatedEmployee = await Employee.findOneAndUpdate({ _id: id }, input, { new: true });
    return updatedEmployee;
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
}


async function deleteEmployee(id) {
  try {
    const result = await Employee.findById(id);

    if (result.currentStatus == '0') {
      await Employee.deleteOne(result);
      return true;
    }
    else return false
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function upcomingRetirements(filter) {
  try {
    const currentDate = new Date();
    const employees = await Employee.find({});//get all the employees array

    const upcomingRetirements = employees.filter((employee) => {
      const remainingYears = 65 - employee.age;

      // Clone the date object to avoid modifying the original one
      const retirementDate = new Date(employee.dateOfJoining);
      //calculating the retirement date
      retirementDate.setFullYear(retirementDate.getFullYear() + remainingYears);

      // for the retirement to be in next six months, the retirement date and current date difference should be 
      // less than 180 days
      return retirementDate - currentDate <= 180 * 24 * 60 * 60 * 1000 && retirementDate >= currentDate;
    });

    return upcomingRetirements != null ? upcomingRetirements : [];
  } catch (error) {
    console.error(error);
  }
}

async function upcomingRetirementsWithFilter(filter) {
  try {
    const currentDate = new Date();
    const employees = await Employee.find(filter);//get all the employees array

    const upcomingRetirements = employees.filter((employee) => {
      const remainingYears = 65 - employee.age;

      // Clone the date object to avoid modifying the original one
      const retirementDate = new Date(employee.dateOfJoining);
      //calculating the retirement date
      retirementDate.setFullYear(retirementDate.getFullYear() + remainingYears);

      // for the retirement to be in next six months, the retirement date and current date difference should be 
      // less than 180 days
      return retirementDate - currentDate <= 180 * 24 * 60 * 60 * 1000 && retirementDate >= currentDate;
    });

    return upcomingRetirements != null ? upcomingRetirements : [];
  } catch (error) {
    console.error(error);
  }
}

module.exports = { ConnectTodb, getEmployeesList, getEmployeesListFilter, addEmployee, 
  deleteEmployee, getEmployeeDetails, updateEmployee, upcomingRetirements, upcomingRetirementsWithFilter };
