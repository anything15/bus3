import React, { useState } from "react";
import "./Header.css";
import MenuIcon from "@mui/icons-material/Menu"; // Importing the MenuIcon for hamburger menu
import SearchIcon from "@mui/icons-material/Search";
import HeaderOption from "./HeaderOption";
import HomeIcon from "@mui/icons-material/Home";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Apey from "./logo.png";

function Header() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="header">
      <div className="header_left">
        <img
          src="https://www.reshot.com/preview-assets/icons/G7YJ8FXBKT/linkedin-G7YJ8FXBKT.svg"
          alt=""
        />
        <div className="header_search">
          <SearchIcon />
          <input type="text" />
        </div>
        {/* Adding the hamburger menu icon */}
        <div
          className="header_hamburger"
          onClick={() => setShowMenu(!showMenu)}
        >
          <MenuIcon />
        </div>
      </div>

      {/* Conditionally render the right part of the header based on the state of the hamburger menu */}
      {!showMenu && (
        <div className="header_right">
          <HeaderOption Icon={HomeIcon} title="Home" />
          <HeaderOption Icon={SupervisorAccountIcon} title="Network" />
          <HeaderOption Icon={BusinessCenterIcon} title="Jobs" />
          <HeaderOption Icon={ChatIcon} title="Messaging" />
          <HeaderOption Icon={NotificationsIcon} title="Notifications" />
          <HeaderOption avatar={Apey} title="Me" />
        </div>
      )}
    </div>
  );
}

export default Header;
