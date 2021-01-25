import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import "../styles/Table.scss";
import axios from 'axios';

function Table() {

  const [tables, setTables] = useState([])

  useEffect(() => {
    const fetchTables = async () => {
      const {data} = await axios.get('/api/tables')
      setTables(data)
    }

    fetchTables()
  }, [])

    //Table show result **
    const showTable = tables
    .filter((table) => table.season === 2021)
    .map((table, index) => (
      <tr key={index}>
        <td className="td__poz">{table.position}</td>
        <td className="td__club">
          <Link to={`/team/${table.team_name.split(' ')[1].toLowerCase()}`}>{table.team_name}</Link>
        </td>
        <td className="td__points">{table.points}</td>
        <td className="td__num">{table.match}</td>
        <td className="td__num">{table.win}</td>
        <td className="td__num">{table.draw}</td>
        <td className="td__num">{table.lose}</td>
        <td className="td__num">{table.goal_plus}</td>
        <td className="td__num">{table.goal_minus}</td>
        <td className="td__num">{table.bilans}</td>
      </tr>
    ));

  return (
    <table className="table">
      <tr>
        <th>Poz</th>
        <th>Club</th>
        <th>PTS</th>
        <th>M</th>
        <th>W</th>
        <th>D</th>
        <th>L</th>
        <th>G+</th>
        <th>G-</th>
        <th>Bil</th>
      </tr>
      {showTable}
    </table>
  );
}

export default Table;
