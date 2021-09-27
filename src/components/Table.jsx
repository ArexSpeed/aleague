import React, {useState, useEffect, useContext} from "react";
import useTeams from "../hooks/useTeams";
import { Link } from "react-router-dom";
import axios from "axios";
import { Context } from "../context/Provider";
import Loader from "./Loader";
function Table() {
  const { teams } = useTeams();
  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState([]);
  const [{ url, darkTheme }] = useContext(Context);
  useEffect(() => {
    setLoading(true);
    const fetchTables = async () => {
      const { data } = await axios.get(`${url}/api/tables`);
      setTables(data);
      setLoading(false);
    };

    fetchTables();
  }, [url]);

  //Table show result **
  const showTable = tables
    .filter((table) => table.season === 2021)
    .sort((a, b) => a.position - b.position)
    .map((table, index) => (
      <tr key={index}>
        <td className={`${darkTheme && "dark"}`}>
          <div
            className={`td__pos ${darkTheme && "dark"} ${
              table.position === 1
                ? "gold"
                : table.position === 2
                ? "silver"
                : table.position === 3
                ? "brown"
                : table.position > 14
                ? "red"
                : table.position > 12
                ? "purple"
                : ""
            }`}
          >
            {table.position}
          </div>
        </td>
        <td className={`${darkTheme && "dark"}`}>
          <Link
            to={`/team/${table.team_name.split(" ")[1].toLowerCase()}`}
            className={`td__club ${darkTheme && "dark"}`}
          >
            {teams
              .filter((team) => team.name === table.team_name)
              .map((team) => (
                <img
                  src={team.logo}
                  className="td__club-image"
                  alt={team.name}
                />
              ))}
            {table.team_name}
          </Link>
        </td>
        <td className={`${darkTheme && "dark"}`}>{table.match}</td>
        <td className={`td__win ${darkTheme && "dark"}`}>{table.win}</td>
        <td className={`${darkTheme && "dark"}`}>{table.draw}</td>
        <td className={`td__lose ${darkTheme && "dark"}`}>{table.lose}</td>
        <td className={`"td__mobileHide" ${darkTheme && "dark"}`}>
          {table.goal_plus}
        </td>
        <td className={`"td__mobileHide" ${darkTheme && "dark"}`}>
          {table.goal_minus}
        </td>
        <td className={`"td__mobileHide" ${darkTheme && "dark"}`}>
          {table.bilans}
        </td>
        <td className={`${darkTheme && "dark"}`}>
          <div className={`td__pts ${darkTheme && "dark"}`}>{table.points}</div>
        </td>
      </tr>
    ));

  return (
    <table className={`table ${darkTheme && "dark"}`}>
      <thead className={`${darkTheme && "dark"}`}>
        <tr>
          <th>Poz</th>
          <th>Club</th>
          <th>M</th>
          <th>W</th>
          <th>D</th>
          <th>L</th>
          <th className="th__mobileHide">G+</th>
          <th className="th__mobileHide">G-</th>
          <th className="th__mobileHide">Bil</th>
          <th>PTS</th>
        </tr>
      </thead>
      <tbody>{loading ? <Loader text="table" /> : showTable}</tbody>
    </table>
  );
}

export default Table;
