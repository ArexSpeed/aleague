import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Context } from "../context";
import "../styles/Sidebar.scss";

const Sidebar = ({ activeSidebar, setActiveSidebar }) => {
  const [teams, setTeams] = useState([]);
  const {  url } = useContext(Context);;
  useEffect(() => {
    const fetchTeams = async () => {
      const { data } = await axios.get(`${url}/api/teams`);
      //console.log(data, "Teams");
      setTeams(data);
    };

    fetchTeams();
  }, []);

  const teamsSite = teams.map((team) => (
    <Link to={`/team/${team.site}`} onClick={() => window.scrollTo(0, 0)}>
      <li
        key={team.id}
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img src={team.logo} alt="" className="sidebar__logo" />
        <br />
        <span className="sidebar__teamName">{team.name}</span>
      </li>
    </Link>
  ));

  return (
    <>
      {activeSidebar && (
        <div className="sidebar">
          <header>Teams</header>
          <ul>{teamsSite}</ul>
        </div>
      )}
    </>
  );
};

export default Sidebar;
