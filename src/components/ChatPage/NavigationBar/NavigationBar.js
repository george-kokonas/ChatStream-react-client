import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import defaultUserIcon from "../../../assets/defaultUserIcon.png";
import "./navigationBar.css";

import {
  MDBNavbarItem,
  MDBDropdown,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBDropdownItem,
  MDBDropdownLink,
} from "mdb-react-ui-kit";

const NavigationBar = ({
  onUserChangeState,
  onDisconnectSocket,
  onSetProfileWindow,
  currentUser,
}) => {
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
            <Navbar.Brand id='navbar-username'>{`Hello, ${currentUser?.username}!`}</Navbar.Brand>

            <MDBNavbarItem>
              <MDBDropdown>
                <MDBDropdownToggle
                  tag='a'
                  className='nav-link d-flex align-items-center'
                  style={{ color: "white" }}
                >
                  <img
                    src={currentUser?.profileImage || defaultUserIcon}
                    alt='avatar'
                    className='rounded-circle d-flex align-self-center me-1 shadow-1-strong'
                    width='32'
                    height='32'
                    loading='lazy'
                  />
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  <MDBDropdownItem>
                    <MDBDropdownLink onClick={() => onSetProfileWindow()}>
                      Set Profile
                    </MDBDropdownLink>
                  </MDBDropdownItem>
                  <MDBDropdownItem>
                    <MDBDropdownLink onClick={logoutHandler}>
                      Logout
                    </MDBDropdownLink>
                  </MDBDropdownItem>
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
