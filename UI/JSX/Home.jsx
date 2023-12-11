import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { Label, NavItem, Nav, Navbar, Grid } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import NavLinks from './navigation.jsx';

const footerStyle = {
  backgroundColor: '#003b49',
  color: '#d0d3d4',
  textAlign: 'center',
  padding: '20px',
  fontSize: '1rem',
};

export default class Home extends React.Component {
  render() {
    const headerStyle = {
      backgroundColor: '#003b49',
      color: '#d0d3d4',
      textAlign: 'center',
      padding: '10px',
    };

    return (
      <Grid fluid>
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>Employee Management System</Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <LinkContainer exact to="/">
            <NavItem  >Home</NavItem>
          </LinkContainer>
          <LinkContainer exact to="/EmployeeCreate">
            <NavItem  >Add Employee </NavItem>
          </LinkContainer>
        </Nav>
      </Navbar>
      <NavLinks />
      <footer style={footerStyle}>&copy; Zaid Alam</footer>
      </Grid>
    )
  }
}