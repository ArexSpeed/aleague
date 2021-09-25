import React from "react";
import { Link } from "react-router-dom";

const Menu = ({ activeSidebar, setActiveSidebar }) => {
  return (
    <nav className="nav">
      <ul className="nav__menu">
        <div className="nav__menu-item">
          <Link className="nav__menu-link" to="/">
            Home
          </Link>
        </div>
        <div className="nav__menu-item">
          <Link className="nav__menu-link" to="/stats">
            Stats
          </Link>
        </div>
        <div className="nav__menu-item">
          <Link className="nav__menu-link" to="/history">
            History
          </Link>
        </div>
        <div className="nav__menu-item">
          <Link className="nav__menu-link" to="/news">
            News
          </Link>
        </div>
        <div className="nav__menu-item">
          <Link className="nav__menu-link" to="/tv">
            AL TV
          </Link>
        </div>
      </ul>
    </nav>
  );
};

export default Menu;
