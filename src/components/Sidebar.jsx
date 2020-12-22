import React from "react";
import { teams } from "../data/teams";
import { Link } from "react-router-dom";

import "../styles/Sidebar.scss";

const Sidebar = () => {
  const teamsSite = teams.map((team) => (
    <li key={team.id}>
      <Link to={`/team/${team.site}`}>{team.name}</Link>
    </li>
  ));

  return (
    <div className="sidebar">
      <header>Teams</header>
      <ul>{teamsSite}</ul>
    </div>
  );
};

export default Sidebar;
