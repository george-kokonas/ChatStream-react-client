import { useNavigate } from "react-router";

import Avatar from "../../../UI/Avatar/Avatar";
import {
  MDBDropdown,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBDropdownItem,
  MDBDropdownLink,
} from "mdb-react-ui-kit";

import styles from "./ProfileButton.module.scss";

const ProfileButton = ({
  currentUser,
  setMainWindowContent,
  onUserChangeState,
  socket,
  setIsBarVisible,
}) => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    socket.emit("logout", socket.id);
    onUserChangeState(false);
    navigate("/");
  };
  return (
    <div className={styles.profile}>
      <MDBDropdown>
        <MDBDropdownToggle
          tag='a'
          style={{ color: "white" }}
          className='d-flex align-items-center'
          href='#'
        >
          <div>
            <Avatar src={currentUser.profileImage} size='medium' />
          </div>
        </MDBDropdownToggle>
        <MDBDropdownMenu>
          <MDBDropdownItem
            onClick={() => {
              setMainWindowContent("profile");
              setIsBarVisible(true)
            }}
          >
            <MDBDropdownLink href='#'>Set Profile</MDBDropdownLink>
          </MDBDropdownItem>
          <MDBDropdownItem onClick={() => logoutHandler()}>
            <MDBDropdownLink href='#'>Log Out</MDBDropdownLink>
          </MDBDropdownItem>
        </MDBDropdownMenu>
      </MDBDropdown>
    </div>
  );
};

export default ProfileButton;
