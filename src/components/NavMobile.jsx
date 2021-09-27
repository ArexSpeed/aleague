import { Link, useLocation } from "react-router-dom";

const NavMobile = () => {
  const { pathname } = useLocation();
  return (
    <div className="navMobile">
      <ul className="navMobile__menu">
        <Link className="navMobile__menu-link" to="/">
          <svg
            className={`navMobile__menu-link-icon ${
              pathname === "/" && "active"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span
            className={`navMobile__menu-link-text ${
              pathname === "/" && "active"
            }`}
          >
            Home
          </span>
        </Link>
        <Link className="navMobile__menu-link" to="/stats">
          <svg
            className={`navMobile__menu-link-icon ${
              pathname === "/stats" && "active"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <span
            className={`navMobile__menu-link-text ${
              pathname === "/stats" && "active"
            }`}
          >
            Stats
          </span>
        </Link>
        <Link className="navMobile__menu-link" to="/history">
          <svg
            className={`navMobile__menu-link-icon ${
              pathname === "/history" && "active"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <span
            className={`navMobile__menu-link-text ${
              pathname === "/history" && "active"
            }`}
          >
            History
          </span>
        </Link>
        <Link className="navMobile__menu-link" to="/news">
          <svg
            className={`navMobile__menu-link-icon ${
              pathname === "/news" && "active"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          <span
            className={`navMobile__menu-link-text ${
              pathname === "/news" && "active"
            }`}
          >
            News
          </span>
        </Link>
        <Link className="navMobile__menu-link" to="/tv">
          <svg
            className={`navMobile__menu-link-icon ${
              pathname === "/tv" && "active"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <span
            className={`navMobile__menu-link-text ${
              pathname === "/tv" && "active"
            }`}
          >
            TV
          </span>
        </Link>
      </ul>
    </div>
  );
};

export default NavMobile;
