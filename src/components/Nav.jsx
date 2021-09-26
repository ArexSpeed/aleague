import React from "react";
import { Link, useLocation } from "react-router-dom";

const Menu = ({ activeSidebar, setActiveSidebar }) => {
  const { pathname } = useLocation();

  return (
    <nav className="nav">
      <ul className="nav__menu">
        <div className={`nav__menu-item ${pathname === "/" && "active"}`}>
          <Link className="nav__menu-link" to="/">
            Home
          </Link>
        </div>
        <div className={`nav__menu-item ${pathname === "/stats" && "active"}`}>
          <Link className="nav__menu-link" to="/stats">
            Stats
          </Link>
        </div>
        <div
          className={`nav__menu-item ${pathname === "/history" && "active"}`}
        >
          <Link className="nav__menu-link" to="/history">
            History
          </Link>
        </div>
        <div className={`nav__menu-item ${pathname === "/news" && "active"}`}>
          <Link className="nav__menu-link" to="/news">
            News
          </Link>
        </div>
        <div className={`nav__menu-item ${pathname === "/tv" && "active"}`}>
          <Link className="nav__menu-link" to="/tv">
            AL TV
          </Link>
        </div>
      </ul>
    </nav>
  );
};

export default Menu;
