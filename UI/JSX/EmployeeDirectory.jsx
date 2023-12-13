import React from 'react';

import EmployeeSearch from "./EmployeeSearch.jsx";
import EmployeeTable from "./EmployeeTable.jsx";
import { Panel, Tabs, Tab } from 'react-bootstrap';
export default class EmployeeDirectory extends React.Component {
  constructor() {
    super();
    this.state = { employees: [], selectedFilter: 'AllEmployee', retirementEmployees: [] };
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    let query;
    try {
      if (this.state.selectedFilter === 'AllEmployee') {
        query = `query {
          employeesList {
            id
            firstName
            lastName
            age
            dateOfJoining
            title
            department
            employeeType
            currentStatus
          }
        }`;
      } else if (this.state.selectedFilter === 'UpcomingRetirements') {
        query = `query {
          upcomingRetirements {
            id
            firstName
            lastName
            age
            dateOfJoining
            title
            department
            employeeType
            currentStatus
          }
        }`;
      } else {
        query = `query {
          employeesListFilter(filter: { employeeType: "${this.state.selectedFilter}" }) {
            id
            firstName
            lastName
            age
            dateOfJoining
            title
            department
            employeeType
            currentStatus
          }
        }`;
      }

      const response = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();
      const dataKey = this.state.selectedFilter === 'AllEmployee'
        ? 'employeesList'
        : this.state.selectedFilter === 'UpcomingRetirements'
          ? 'upcomingRetirements'
          : 'employeesListFilter';

      this.setState({ ...this.state, employees: result.data[dataKey] });

      const upcomingRetirementsQuery = `query {
        upcomingRetirements {
          id
          firstName
          lastName
          age
          dateOfJoining
          title
          department
          employeeType
          currentStatus
        }
      }`;

      const upcomingRetirementsResponse = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: upcomingRetirementsQuery }),
      });

      const upcomingRetirementsResult = await upcomingRetirementsResponse.json();
      const upcomingRetirements = upcomingRetirementsResult.data.upcomingRetirements;

      // Set the state with both sets of data
      this.setState({
        ...this.state,
        retirementEmployees: upcomingRetirements,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }



  handleFilterChange = (selectedFilter) => {
    this.setState({ selectedFilter });
  };

  handleFilterClick = () => {
    this.loadData();
  };

  handleEmployeeDeleted = (deletedEmployeeId) => {
    const updatedEmployees = this.state.employees.filter(employee => employee.id !== deletedEmployeeId);
    this.setState({ employees: updatedEmployees });
  };

  render() {
    const containerStyle = {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
    };

    return (
      <React.Fragment>
        <Panel>
          <Panel.Heading>
            <Panel.Title toggle>Filter</Panel.Title>
          </Panel.Heading>
          <Panel.Body collapsible>
            <EmployeeSearch
              onFilterChange={this.handleFilterChange}
              onFilterClick={this.handleFilterClick}
              selectedFilter={this.state.selectedFilter}
            />
          </Panel.Body>
        </Panel>
        <Tabs defaultActiveKey="allEmployees">
          <Tab eventKey="allEmployees" title="All Employees">
            <EmployeeTable style={containerStyle}
              allEmployees={this.state.employees}
              onEmployeeDeleted={this.handleEmployeeDeleted} />
          </Tab>
          <Tab eventKey="retirementEmployees" title="Upcoming Retirements">
            <EmployeeTable style={containerStyle}
              allEmployees={this.state.retirementEmployees}
              onEmployeeDeleted={this.handleEmployeeDeleted} />
          </Tab>
        </Tabs>
      </React.Fragment>
    );
  }
}
