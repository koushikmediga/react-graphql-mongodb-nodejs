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
    let employeeListQuery;
    let upcomingRetirementsQuery;
    try {
      if (this.state.selectedFilter === 'AllEmployee') {
        employeeListQuery = ` {
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
        upcomingRetirementsQuery = ` {
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
        employeeListQuery = ` {
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
        upcomingRetirementsQuery = ` {
          upcomingRetirementsFilter(filter: { employeeType: "${this.state.selectedFilter}" }) {
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
        body: JSON.stringify({ query : employeeListQuery }),
      });

      const result = await response.json();
      console.log(result, " is complete list")
      const dataKey = this.state.selectedFilter === 'AllEmployee'
        ? 'employeesList' : 'employeesListFilter';
      const dataKey2 = this.state.selectedFilter === 'AllEmployee'
      ? 'upcomingRetirements' : 'upcomingRetirementsFilter';

      const upcomingRetirementsResponse = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query : upcomingRetirementsQuery }),
      });

      const upcomingRetirementsResult = await upcomingRetirementsResponse.json();
      console.log(upcomingRetirementsResult," is the upcoming retirement ")
      // const upcomingRetirements = upcomingRetirementsResult.data.upcomingRetirements;

      // Set the state with both sets of data
      this.setState({
        ...this.state,
        employees: result.data[dataKey] ,
        retirementEmployees: upcomingRetirementsResult.data[dataKey2],
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
