import { useContext } from "react";
import { Context } from "../context/Provider";
import { actions } from "../context/reducer";
import { Link, useLocation } from "react-router-dom";

const Menu = () => {
  const [{ darkTheme }, dispatch] = useContext(Context);
  const { pathname } = useLocation();

  return (
    <nav className="nav">
      <ul className="nav__menu">
        <button
          className={`nav__menu-open ${darkTheme && "dark"}`}
          onClick={() => dispatch({ type: actions.toggleMobileSidebar })}
        >
          <svg
            className="nav__menu-open-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <span className="nav__menu-open-text">Teams</span>
        </button>
        <div className={`nav__menu-item ${pathname === "/" && "active"}`}>
          <Link className={`nav__menu-link ${darkTheme && "dark"}`} to="/">
            Home
          </Link>
        </div>
        <div className={`nav__menu-item ${pathname === "/stats" && "active"}`}>
          <Link className={`nav__menu-link ${darkTheme && "dark"}`} to="/stats">
            Stats
          </Link>
        </div>
        <div
          className={`nav__menu-item ${pathname === "/history" && "active"}`}
        >
          <Link
            className={`nav__menu-link ${darkTheme && "dark"}`}
            to="/history"
          >
            History
          </Link>
        </div>
        <div className={`nav__menu-item ${pathname === "/news" && "active"}`}>
          <Link className={`nav__menu-link ${darkTheme && "dark"}`} to="/news">
            News
          </Link>
        </div>
        <div className={`nav__menu-item ${pathname === "/tv" && "active"}`}>
          <Link className={`nav__menu-link ${darkTheme && "dark"}`} to="/tv">
            AL TV
          </Link>
        </div>
      </ul>
    </nav>
  );
};

export default Menu;
