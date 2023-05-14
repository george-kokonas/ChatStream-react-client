import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { MDBTabs, MDBTabsItem, MDBTabsLink } from "mdb-react-ui-kit";

const Tabs = ({ onSelection }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");

  const handleUserClick = (value) => {
    if (value === activeTab) {
      return;
    }
    setActiveTab(value);
    onSelection(value);
    navigate(`/${value}`);
  };

  return (
    <>
      {/* SIGN UP TAB */}
      <MDBTabs pills className='mb-3'>
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => handleUserClick("signup")}
            active={activeTab === "signup"}
          >
            Sign Up
          </MDBTabsLink>
        </MDBTabsItem>

        {/* LOGIN TAB */}
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => handleUserClick("login")}
            active={activeTab === "login"}
          >
            Log In
          </MDBTabsLink>
        </MDBTabsItem>

        {/* ABOUT TAB */}
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => handleUserClick("about")}
            active={activeTab === "about"}
          >
            About
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      {/* 
       <MDBTabsContent>
        <MDBTabsPane show={activeTab === "signup"} />
        <MDBTabsPane show={activeTab === "login"} />
        <MDBTabsPane show={activeTab === "about"} />
  </MDBTabsContent>*/}
    </>
  );
};

export default Tabs;
