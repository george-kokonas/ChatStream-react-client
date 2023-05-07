import React, { useState, useEffect } from "react";
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
} from "mdb-react-ui-kit";

const Tabs = ({ onSelection }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [userSelection, setUserSelection] = useState("");

  const handleBasicClick = (value) => {
    if (value === activeTab) {
      return;
    }
    setActiveTab(value);
    setUserSelection(value);
  };

  useEffect(() => {
    onSelection(userSelection);
  });

  return (
    <>
      <MDBTabs pills className='mb-3'>
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => handleBasicClick("signup")}
            active={activeTab === "signup"}
          >
            Sign Up
          </MDBTabsLink>
        </MDBTabsItem>

        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => handleBasicClick("login")}
            active={activeTab === "login"}
          >
            Log In
          </MDBTabsLink>
        </MDBTabsItem>

        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => handleBasicClick("about")}
            active={activeTab === "about"}
          >
            About
          </MDBTabsLink>
        </MDBTabsItem>
        
      </MDBTabs>

      <MDBTabsContent>
        <MDBTabsPane show={activeTab === "signup"} />
        <MDBTabsPane show={activeTab === "login"} />
        <MDBTabsPane show={activeTab === "about"} />
      </MDBTabsContent>
    </>
  );
};

export default Tabs;
