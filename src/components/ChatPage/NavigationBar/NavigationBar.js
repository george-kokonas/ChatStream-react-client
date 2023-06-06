import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import defaultUserIcon from "../../../assets/defaultUserIcon.png";
import "./navigationBar.css";

import sound from "../../../assets/newUnreadSound.wav";

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
  onSetProfileWindow,
  currentUser,
  navUnreadMessages,
  onExitRoom,
  socket,
}) => {
  const navigate = useNavigate();
  const audioRef = useRef(null);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    socket.emit("logout", socket.id);
    onUserChangeState(false);
    navigate("/");
  };

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  useEffect(() => {
    if (navUnreadMessages) {
      playSound();
    }
  }, [navUnreadMessages]);

  return (
    <>
      <Navbar className='navbar'>
        <Container>
          <Navbar.Brand id='navbar-logo'>ChatStream</Navbar.Brand>

          {navUnreadMessages && (
            <>
              <FontAwesomeIcon
                className='unread-msg-icon'
                icon={faMessage}
                size='xl'
                bounce
              />
              <audio ref={audioRef} src={sound} />
            </>
          )}
          <Nav className=''>
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
                    className='rounded-circle me-1 shadow-1-strong'
                    width='32'
                    height='32'
                    loading='lazy'
                  />
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  <MDBDropdownItem>
                    <MDBDropdownLink
                      onClick={() => {
                        onSetProfileWindow();
                        onExitRoom();
                      }}
                    >
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
