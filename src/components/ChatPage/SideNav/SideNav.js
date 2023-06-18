import { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useNavigate } from "react-router";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { faUsersBetweenLines } from "@fortawesome/free-solid-svg-icons";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";

import defaultUserIcon from "../../../assets/defaultUserIcon.png";
import styles from "./SideNav.module.scss";

const SideNav = ({
  setNavSelection,
  navSelection,
  setCurrentRoom,
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
    <Sidebar
      className={styles.sidebar}
      collapsed={isCollapsed}
      width='145px'
      collapsedWidth='77px'
    >
      <Menu>
        <MenuItem
          className={styles.navItem}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <FontAwesomeIcon className={styles.icon} icon={faBars} size='xl' />
          {/* <span className={styles.text}> Chatstream</span> */}
        </MenuItem>

        <MenuItem
          className={styles.navItem}
          onClick={() => {
            setNavSelection("users");
            setCurrentRoom(null);
          }}
        >
          <FontAwesomeIcon
            className={styles.icon}
            icon={faUsersBetweenLines}
            size='xl'
          />
          <span className={styles.text}>Users</span>
        </MenuItem>

        <MenuItem
          className={styles.navItem}
          onClick={() => {
            setNavSelection("conversations");
            setCurrentRoom(null);
          }}
        >
          <FontAwesomeIcon className={styles.icon} icon={faMessage} size='xl' />
          <span className={styles.text}>Chats</span>
        </MenuItem>

        <MenuItem
          className={styles.navItem}
          onClick={() => {
            setNavSelection("profile");
            setCurrentRoom();
            setIsCollapsed(true);
          }}
        >
          <img
            src={currentUser.profileImage || defaultUserIcon}
            alt='avatar'
            className={`${styles.icon} `}
            // width='2px'
          />
          <span className={styles.text}>Profile</span>
        </MenuItem>

        <MenuItem className={styles.navItem} onClick={() => logoutHandler()}>
          <FontAwesomeIcon
            className={styles.icon}
            icon={faArrowRightFromBracket}
            size='xl'
          />
          <span className={styles.text}>Logout</span>
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default SideNav;
