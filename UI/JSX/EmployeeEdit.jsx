import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Row, Col, Form, FormControl } from 'react-bootstrap';
import Toast from './Toast.jsx';

const EmployeeEdit = () => {
  const { id } = useParams();
  const [employeeData, setEmployeeData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    age: 0,
    dateOfJoining: '',
    title: '',
    department: '',
    employeeType: '',
  });

  const [retirement, setRetirement] = useState();

  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const currentDate = new Date();
    const remainingYears = 65 - employeeData.age;

    const retirementDate = new Date(employeeData.dateOfJoining);
    //calculating the retirement date
    retirementDate.setFullYear(retirementDate.getFullYear() + remainingYears);

    if (retirementDate >= currentDate) {
      const timeDifference = retirementDate - currentDate;
      const yearsRemaining = Math.floor(timeDifference / (365.25 * 24 * 60 * 60 * 1000));
      const monthsRemaining = Math.floor((timeDifference % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));
      const daysRemaining = Math.floor((timeDifference % (30.44 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000));

      const retirementstring = `${yearsRemaining} Years, ${monthsRemaining} Months,${daysRemaining} Days left for retirement`;
      setRetirement(retirementstring);
    } else setRetirement('already retired')


  }, [employeeData])

  useEffect(() => {
    const fetchData = async () => {
      const query = `
        query {
          employeeById(id: "${id}") {
            id
            firstName
            lastName
            age
            dateOfJoining
            title
            department
            employeeType
          }
        }
      `;

      try {
        const response = await fetch('http://localhost:8000/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        });

        const result = await response.json();

        if (result.data && result.data.employeeById) {
          setEmployeeData(result.data.employeeById);
        } else {
          console.error('Error fetching employee details');
        }
      } catch (error) {
        console.error('Error fetching employee details:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const query = `
      mutation {
        updateEmployee(id: "${id}", input: {
          firstName: "${employeeData.firstName}",
          lastName: "${employeeData.lastName}",
          age: ${employeeData.age},
          dateOfJoining: "${employeeData.dateOfJoining}",
          title: "${employeeData.title}",
          department: "${employeeData.department}",
          employeeType: "${employeeData.employeeType}"
        }) {
          id
          firstName
          lastName
          age
          dateOfJoining
          title
          department
          employeeType
        }
      }
    `;

    try {
      const response = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query }),
      });

      const result = await response.json();

      if (result.data && result.data.updateEmployee) {
        setShowToast(true)
      } else {
        console.error('Error while updating employee');
      }
    } catch (error) {
      console.error('Error while updating employee:', error);
    }
  };

  const createStyle = {
    marginTop: '1%',
    borderBottom: '1px solid black'
  };

  const headingStyle = {
    color: '#003b49',
    marginLeft: '8px',
  };

  const formStyle = {
    maxWidth: '500px',
    marginLeft: '20%',
    paddingBottom: '20px',
  };

  const inputStyle = {
    width: '100%',
    padding: '1%',
    marginBottom: '5%',
    marginRight: '2%',
    border: '1px solid #d0d3d4',
    borderRadius: '5px',
    fontSize: '1rem',
  };

  const buttonStyle = {
    backgroundColor: '#003b49',
    color: '#d0d3d4',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1.2rem',
  };

  const erroStyle = {
    color: 'red',
    marginTop: '-15px',
    fontSize: '1rem',
  };

  return (
    <React.Fragment>
      <Toast
        showing={showToast}
        bsStyle="success"
        onDismiss={() => setShowToast(false)}
      >Employee updated successfully</Toast>
      <Row style={createStyle} lg={12}>

        <Col> <h3 style={headingStyle}>Update Employee</h3></Col>
        <Col lg={12}>
          <Form style={formStyle} name="UpdateEmployee" onSubmit={handleSubmit}>
            <h3 style={{ color: '#FFDF00' }}>{retirement}</h3>
            
            <FormControl
              componentClass="input"
              type="text"
              name="firstName"
              placeholder="First Name"
              disabled
              style={inputStyle}
              value={employeeData.firstName}
              onChange={handleInputChange}
            />
            <FormControl
              componentClass="input"
              name="lastName"
              placeholder="Last Name"
              disabled
              style={inputStyle}
              value={employeeData.lastName}
              onChange={handleInputChange}
            />
            <FormControl
              componentClass="input"
              name="age"
              placeholder="Age"
              disabled
              style={inputStyle}
              value={employeeData.age}
              onChange={handleInputChange}
            />
            <FormControl
              componentClass="input"
              name="dateOfJoining"
              placeholder="Date Of Joining"
              disabled
              style={inputStyle}
              value={employeeData.dateOfJoining}
              onChange={handleInputChange}
            />
            <FormControl
              componentClass="select"
              name="title"
              style={inputStyle}
              value={employeeData.title}
              onChange={handleInputChange}
            >
              <option value="" disabled>
                Select Title
              </option>
              <option value="Employee">Employee</option>
              <option value="VP">VP</option>
              <option value="Manager">Manager</option>
              <option value="Director">Director</option>
            </FormControl>
            <FormControl
              componentClass="select"
              name="department"
              style={inputStyle}
              value={employeeData.department}
              onChange={handleInputChange}
            >
              <option value="" disabled>
                Select Department
              </option>
              <option value="IT">IT</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">HR</option>
              <option value="Engineering">Engineering</option>
            </FormControl>
            <FormControl
              componentClass="select"
              name="employeeType"
              style={inputStyle}
              value={employeeData.employeeType}
              onChange={handleInputChange}
            >
              <option value="" disabled>
                Select Employee Type
              </option>
              <option value="FullTime">FullTime</option>
              <option value="PartTime">PartTime</option>
              <option value="Contract">Contract</option>
              <option value="Seasonal">Seasonal</option>
            </FormControl>
            <Button type="submit" style={buttonStyle}>
              Update
            </Button>
          </Form>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default EmployeeEdit;