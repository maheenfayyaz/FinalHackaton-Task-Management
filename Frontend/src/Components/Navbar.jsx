import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice.mjs';
import { Navbar, Nav, Container, Image } from 'react-bootstrap';
import '../assets/css/style.css';

const MyNavbar = ({ userName, userImage }) => {
  // console.log('Navbar userImage:', userImage);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const defaultImage = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/createtaskform" className="custom-button" >Create Task</Nav.Link>
          </Nav>
          <Nav className="d-flex align-items-center">
            <Nav.Link as={Link} to="/login" className="custom-button" >Login</Nav.Link>
            <Nav.Link as={Link} to="/" className="custom-button" >Signup</Nav.Link>
            <Nav.Link onClick={handleLogout}  className="custom-button">Logout</Nav.Link>
            <div className="d-flex align-items-center ms-3">
              <Link to="/profile" style={{ display: 'inline-block' }}>
                <Image
                  src={userImage || defaultImage}
                  alt="Profile"
                  roundedCircle
                  className="me-2"
                  style={{ width: '26px', height: '26px', cursor: 'pointer' }}
                />
              </Link>
              <span className='user-name'>{userName || 'User Name'}</span>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
