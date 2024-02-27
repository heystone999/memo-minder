import { Link } from "react-router-dom";
import "./NavBar.css";
import React, { useState } from "react";

function Navbar({ showTaskArea, showShop, showChallenge, handleTaskClick, handleShopClick, handleChallengeClick }) {
  const [open, setOpen] = useState(false);

  return (
    <nav>
      <div className="nav-left">
        <Link className="logo" to="/">
          MEMO MINDER
        </Link>
        <Link to="/" onClick={handleTaskClick} className={showTaskArea ? "active" : ""}>
        <span>Tasks</span>
        </Link>
        <Link to="/" onClick={handleShopClick} className={showShop ? "active" : ""}>
        <span>Shops</span>
        </Link>
        <Link to="/" onClick={handleChallengeClick} className={showChallenge ? "active" : ""}>
        <span>Challenges</span>
        </Link>
      </div>
      <div className="nav-middle"></div>
      <div className="nav-right">
        <div className="user">
          <img
            className="user-pic"
            src="/user-pic.JPG"
            alt=""
            onClick={() => {
              setOpen(!open);
            }}
          />
          <span className="user-name">Ray</span>
        </div>
      </div>
      {/* User dropdown menu */}
      <div className={`user-menu ${open ? "active" : "inactive"}`}>
        <ul>
          <UserMenu text={"Log Out"} />
        </ul>
      </div>
    </nav>
  );
}

function UserMenu(props) {
  return (
    <li className="user-menu-item">
      {/* just for eslint scan */}
      <a href="/login" className="logout-link">
        {" "}
        {props.text}{" "}
      </a>
    </li>
  );
}

export default Navbar;
