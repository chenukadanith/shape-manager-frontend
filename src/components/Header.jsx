import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Header = ({ activeView, setActiveView, onLogout }) => {
  const navigate = useNavigate();
  const username = JSON.parse(localStorage.getItem('user')).username;
  // console.log(userData);

// logout function
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
          <Nav className="me-auto"> 
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

         
          <Nav className="align-items-center"> 
            <h5 className="mb-0 me-3 text-white">Welcome, {username}!</h5> 

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