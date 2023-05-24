import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "./navigationBar.css";
import {
  MDBNavbarItem,
  MDBDropdown,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBDropdownItem,
  MDBDropdownLink,
} from "mdb-react-ui-kit";

const NavigationBar = ({ onUserChangeState, onDisconnectSocket, user }) => {
  const navigate = useNavigate();
  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onDisconnectSocket();
    navigate("/");
    onUserChangeState(false);
  };
  return (
    <>
      <Navbar className='navbar'>
        <Container>
          <Navbar.Brand id='navbar-logo'>ChatStream</Navbar.Brand>
          <Nav className='d-flex flex-row mb-0'>
            <Navbar.Brand id='navbar-username'>{`Hello ${user.username}!`}</Navbar.Brand>

            <MDBNavbarItem>
              <MDBDropdown>
                <MDBDropdownToggle
                  tag='a'
                  className='nav-link d-flex align-items-center'
                  href='#'
                  style={{ color: "white" }}
                >
                  <img
                    src='https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-8.webp'
                    alt='avatar'
                    className='rounded-circle d-flex align-self-center me-1 shadow-1-strong'
                    width='35'
                    loading='lazy'
                  />
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  <MDBDropdownItem>
                    <MDBDropdownLink onClick={logoutHandler} href='#'>
                      Logout
                    </MDBDropdownLink>
                  </MDBDropdownItem>
                  <MDBDropdownItem>
                    <MDBDropdownLink href='#'>Set Avatar</MDBDropdownLink>
                  </MDBDropdownItem>
                  <MDBDropdownItem></MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavbarItem>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default NavigationBar;