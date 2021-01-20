import React, {useEffect, useState} from "react";
//import { teams } from "../data/teams";
import { Link } from "react-router-dom";
import axios from 'axios'

import "../styles/Sidebar.scss";

const Sidebar = () => {
  const [teams, setTeams] = useState([])

  useEffect(() => {
    const fetchTeams = async () => {
      const { data } = await axios.get('/api/teams')
      console.log(data, 'Teams')
      setTeams(data)
    }

    fetchTeams()
  }, [])

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
