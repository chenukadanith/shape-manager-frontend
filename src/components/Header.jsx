import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Header = ({ activeView, setActiveView, onLogout }) => {
  const navigate = useNavigate();
  const username = JSON.parse(localStorage.getItem('user')).username;
  // console.log(userData);


  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand href="#home">
          <i className="fas fa-shapes me-2"></i>
          Shape Manager
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          {/* Main navigation links - pushed to the left by default */}
          <Nav className="me-auto"> {/* This Nav takes up available space */}
            <Nav.Link
              active={activeView === 'shapes'}
              onClick={() => setActiveView('shapes')}
              style={{ cursor: 'pointer' }}
            >
              <i className="fas fa-list me-1"></i>
              Manage Shapes
            </Nav.Link>
            <Nav.Link
              active={activeView === 'canvas'}
              onClick={() => setActiveView('canvas')}
              style={{ cursor: 'pointer' }}
            >
              <i className="fas fa-paint-brush me-1"></i>
              Canvas View
            </Nav.Link>
          </Nav>

          {/* Combined Nav for Username and Logout Button */}
          {/* This Nav will be pushed to the far right because of the 'me-auto' on the previous Nav */}
          <Nav className="align-items-center"> {/* Align items vertically in the middle */}
            <h5 className="mb-0 me-3 text-white">Welcome, {username}!</h5> {/* Added me-3 for spacing */}

            <Button variant="outline-light" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt me-1"></i>
              Logout
            </Button>
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;