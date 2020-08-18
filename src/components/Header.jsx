import React from "react";
import {Link} from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";

function Header(props) {
  
  function logout() {
    fetch("/logout");
    window.location.reload();
  }

  return (
    <Navbar collapseOnSelect expand="md" bg="info" variant="dark" fixed="top">
      <Navbar.Brand as={Link} to="/">Covid-19 Tracking</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link as={Link} to="/doc">REST API</Nav.Link>
          {!props.isLoggedIn && <Nav.Link as={Link} to="/login">Login</Nav.Link>}
          {!props.isLoggedIn && <Nav.Link as={Link} to="/signup">Sign Up for API</Nav.Link>}
          {props.isLoggedIn && 
          <NavDropdown title="Me" alignRight>
            <NavDropdown.Item as={Link} to="/account">My API Account</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onSelect={logout}>Logout</NavDropdown.Item>
          </NavDropdown>}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
