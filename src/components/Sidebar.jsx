import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Context } from "../context";
import Loader from "./Loader";
import logo from "../images/AL.png";

const Sidebar = ({ activeSidebar }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const { url } = useContext(Context);
  useEffect(() => {
    setLoading(true);
    const fetchTeams = async () => {
      const { data } = await axios.get(`${url}/api/teams`);

      setTeams(data);
      setLoading(false);
    };

    fetchTeams();
  }, []);

  const teamsSite = teams.map((team) => (
    <Link
      key={team.id}
      to={`/team/${team.site}`}
      onClick={() => window.scrollTo(0, 0)}
    >
      <li className="sidebar__list-item">
        <img src={team.logo} alt="" className="sidebar__logo" />
      </li>
    </Link>
  ));

  return (
    <>
      <div className="sidebar">
        <header className="sidebar__header">
          <img className="sidebar__header-image" src={logo} alt="" />
        </header>
        {loading && <Loader text="teams" />}
        <ul className="sidebar__list">{teamsSite}</ul>
        <div className="sidebar__switcher">
          <button className="sidebar__switcher-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              enable-background="new 0 0 24 24"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#FFFFFF"
            >
              <g>
                <path d="M0,0h24v24H0V0z" fill="none" />
              </g>
              <g>
                <path d="M12,4.81L12,19c-3.31,0-6-2.63-6-5.87c0-1.56,0.62-3.03,1.75-4.14L12,4.81 M12,2L6.35,7.56l0,0C4.9,8.99,4,10.96,4,13.13 C4,17.48,7.58,21,12,21c4.42,0,8-3.52,8-7.87c0-2.17-0.9-4.14-2.35-5.57l0,0L12,2z" />
              </g>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
