import React from 'react';
import {
  Button, Glyphicon, Tooltip, OverlayTrigger
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Toast from './Toast.jsx';
export default class EmployeeRow extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showToast: false,
      showToastWarning: false,
    };

    this.handleDelete = this.handleDelete.bind(this);
  }

  async handleDelete() {
    const id = this.props.rowEmployee.id;

    const query = `
      mutation {
        deleteEmployee(id: "${id}")
      }
    `;
    const response = await fetch('http://localhost:8000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: query }),
    });

    const result = await response.json();

    if (result.data.deleteEmployee) {
      this.setState({ showToast: true, showToastWarning: false });

      setTimeout(() => {
        this.props.onEmployeeDeleted(id);
      }, 1000);
    } else {
      this.setState({ showToast: false, showToastWarning: true });
      console.error('Error deleting employee');
    }
  }

  render() {
    const employeeId = this.props.rowEmployee.id;

    const rowStyle = {
      border: '1px solid #d0d3d4',
      padding: '10px',
      textAlign: 'left',
    };

    const linkStyle = {
      color: '#3498db',
      textDecoration: 'none',
      marginRight: '1rem',
      cursor: 'pointer'
    };

    return (
      <React.Fragment>
        <Toast
          showing={this.state.showToast}
          bsStyle="success"
          onDismiss={() =>  this.setState({ showToast: false }) }
          autohide
          delay={5000} 
        >
          Employee deleted successfully
        </Toast>

        <Toast
          showing={this.state.showToastWarning}
          bsStyle="warning"
          onDismiss={() => this.setState({ showToastWarning: false })}
          autohide
          delay={5000} 
        >
          CANNOT DELETE EMPLOYEE STATUS ACTIVE
        </Toast>

        <tr>
          <td style={rowStyle}>{this.props.rowEmployee.firstName}</td>
          <td style={rowStyle}>{this.props.rowEmployee.lastName}</td>
          <td style={rowStyle}>{this.props.rowEmployee.age}</td>
          <td style={rowStyle}>{this.props.rowEmployee.dateOfJoining}</td>
          <td style={rowStyle}>{this.props.rowEmployee.title}</td>
          <td style={rowStyle}>{this.props.rowEmployee.department}</td>
          <td style={rowStyle}>{this.props.rowEmployee.employeeType}</td>
          <td style={rowStyle}>{this.props.rowEmployee.currentStatus == 1 ? 'Working' : 'Retired'}</td>
          <td style={rowStyle}>

            <OverlayTrigger delayShow={500} overlay={<Tooltip id="close-tooltip" placement="top">Edit Employee</Tooltip>}>
              <LinkContainer to={`/EmployeeEdit/${employeeId}`} style={linkStyle}>
                <Glyphicon glyph="edit" />
              </LinkContainer>
            </OverlayTrigger>

            <OverlayTrigger delayShow={500} overlay={<Tooltip id="close-tooltip" placement="top">Delete Employee</Tooltip>}>
              <Button bsSize="xsmall" onClick={this.handleDelete}>
                <Glyphicon glyph="trash" />
              </Button>
            </OverlayTrigger>

          </td>
        </tr>
      </React.Fragment>
    );
  }
}
