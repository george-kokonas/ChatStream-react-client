import React, { useEffect, useRef, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { MDBDropdown, MDBDropdownLink } from "mdb-react-ui-kit";

import styles from "./ThreeDotsMenu.module.scss";

const ThreeDotsMenu = ({ roomId, deleteRoomHandler }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef(null);

  const toggleHandler = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    //When user clicks outside close 3-dots menu
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    //Attach listener
    window.addEventListener("click", handleClickOutside);

    //Remove listener
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [])


  return (
    <div className={styles.threeDotsMenuContainer} ref={menuRef}>
      {isOpen && (
        <div className={styles.threeDotsMenuOverlay}>
          <div className={styles.menuItemWrapper}>
            <MDBDropdown>
              <MDBDropdownLink onClick={() => deleteRoomHandler(roomId)}>
                Delete Chat
              </MDBDropdownLink>
            </MDBDropdown>
          </div>
        </div>
      )}
      <FontAwesomeIcon onClick={toggleHandler} icon={faEllipsis} size='xl' />
    </div>
  );
};

export default ThreeDotsMenu;
