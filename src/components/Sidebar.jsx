import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Context } from "../context";
import "../styles/Sidebar.scss";
import Loader from "./Loader";

const Sidebar = ({ activeSidebar }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const { url } = useContext(Context);
  useEffect(() => {
    setLoading(true);
    const fetchTeams = async () => {
      const { data } = await axios.get(`${url}/api/teams`);
      //console.log(data, "Teams");
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
      <li
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
          {loading && <Loader text="teams" />}
          <ul>{teamsSite}</ul>
        </div>
      )}
    </>
  );
};

export default Sidebar;
