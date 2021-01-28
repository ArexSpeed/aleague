import React from "react";
import { Link } from "react-router-dom";

import "../styles/Menu.scss";

const Menu = ({activeSidebar, setActiveSidebar}) => {
  return (
    <header className="header">
      <ul>
        <Link className="header__link header__link-teams" onClick={() => setActiveSidebar(!activeSidebar)}>
          Teams
        </Link>
        <Link className="header__link" to="/">
          Home
        </Link>
        <Link className="header__link" to="/stats">
          Stats
        </Link>
        <Link className="header__link" to="/history">
          History
        </Link>
        <Link className="header__link" to="/news">
          News
        </Link>
        <Link className="header__link" to="/tv">
          AL TV
        </Link>
      </ul>
    </header>
  );
};

export default Menu;
