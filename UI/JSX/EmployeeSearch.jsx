import React from 'react';
import { Button, Row, Form, FormControl , Col} from 'react-bootstrap';
export default class EmployeeSearch extends React.Component {

  constructor(props) {
    super(props);
    this.handleFilterClick = this.handleFilterClick.bind(this);
  }
  handleChange = (e) => {
    this.props.onFilterChange(e.target.value);
  };

  handleFilterClick() {
    this.props.onFilterClick();
  };

  render() {
    const searchStyle = {
      borderBottom: '1px solid black',
      paddingBottom: '10px',
      marginTop: '25px',
      marginLeft: '5px'
    };

    const buttonStyle = {
      backgroundColor: '#003b49',
      color: '#d0d3d4'
    };

    return (
      <Row style={searchStyle}>
        <Col md={4}>
          <Form>
            <FormControl componentClass="select" name="title" value={this.props.selectedFilter} onChange={this.handleChange}>
              <option value="" disabled>Select to filter employees</option>
              <option value="AllEmployee">All Employees</option>
              <option value="FullTime">FullTime Employees</option>
              <option value="PartTime">PartTime Employees</option>
              <option value="Contract">Contract Employees</option>
              <option value="Seasonal">Seasonal Employees</option>
              <option value="UpcomingRetirements">Upcoming Retirements</option>
            </FormControl>
          </Form>
        </Col>
        <Col md={2}>
          <Button md={2} style={buttonStyle} value={'Filter'} onClick={this.handleFilterClick} >Filter</Button>
        </Col>
      </Row>
    );
  }
}
