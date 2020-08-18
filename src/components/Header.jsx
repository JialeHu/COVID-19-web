import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropDown";

function Header(props) {
  
  function logout() {
    fetch("/logout");
  }

  return (
    <Navbar collapseOnSelect expand="md" bg="info" variant="dark">
      <Navbar.Brand href="/">Covid-19 Tracking</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link href="/doc">REST API</Nav.Link>
          {!props.isLoggedIn && <Nav.Link href="/login">Login</Nav.Link>}
          {!props.isLoggedIn && <Nav.Link href="/signup">Sign Up for API</Nav.Link>}
          {props.isLoggedIn && 
          <NavDropdown title="Me">
            <NavDropdown.Item href="/account">My API Account</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onSelect={logout}>Logout</NavDropdown.Item>
          </NavDropdown>}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
