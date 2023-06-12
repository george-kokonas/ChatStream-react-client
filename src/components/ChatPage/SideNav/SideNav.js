import { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useNavigate } from "react-router";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { faUsersBetweenLines } from "@fortawesome/free-solid-svg-icons";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import defaultUserIcon from "../../../assets/defaultUserIcon.png";

const SideNav = ({
  setNavSelection,
  navSelection,
  setCurrentRoom,
  setHiddentElement,
  hiddenElement,
  currentUser,
  onUserChangeState,
  socket,
}) => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    socket.emit("logout", socket.id);
    onUserChangeState(false);
    navigate("/");
  };

  return (
    <Sidebar collapsed={isCollapsed} width='15vw' collapsedWidth='18vw'>
      <Menu>
        <MenuItem
          onClick={() => setIsCollapsed(!isCollapsed)}
          className='menu1'
        >
          <FontAwesomeIcon icon={faBars} size='xl' />
        </MenuItem>

        <MenuItem
          onClick={() => {
            //leave from profile page only with X btn
            if (navSelection === "profile") return;
            setNavSelection("users");
            setCurrentRoom(null);
          }}
        >
          <FontAwesomeIcon icon={faUsersBetweenLines} size='xl' />
          Users
        </MenuItem>

        <MenuItem
          onClick={() => {
            if (navSelection === "profile" ) return;

            if (!hiddenElement) {
              setHiddentElement();
            }
            
            setCurrentRoom(null);
            setNavSelection("conversations");
          }}
        >
          <FontAwesomeIcon
            className='unread-msg-icon'
            icon={faMessage}
            size='xl'
          />
          Conversations
        </MenuItem>

        <MenuItem
          onClick={() => {
            setNavSelection("profile");
            setCurrentRoom();
          }}
        >
          <img
            src={currentUser.profileImage || defaultUserIcon}
            alt='avatar'
            className='rounded-circle align-self-center me-1 shadow-1-strong'
            width='30'
            height='30'
          />
          Profile
        </MenuItem>

        <MenuItem onClick={() => logoutHandler()}>
          <FontAwesomeIcon icon={faArrowRightFromBracket} size='xl' />
          Logout
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default SideNav;
