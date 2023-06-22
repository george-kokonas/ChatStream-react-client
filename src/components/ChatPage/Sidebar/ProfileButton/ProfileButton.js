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
          className='d-flex align-items-center'
          href='#'
        >
          <div>
            <Avatar src={currentUser.profileImage} size='medium' />
          </div>
        </MDBDropdownToggle>
        <MDBDropdownMenu>
          <MDBDropdownItem onClick={() => setMainWindowContent("profile")}>
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