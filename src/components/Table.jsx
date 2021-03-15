import React, {useState, useEffect, useContext} from "react";
import { Link } from "react-router-dom";
import "../styles/Table.scss";
import axios from 'axios';
import {Context} from '../context'
function Table() {
  const [tables, setTables] = useState([])
  const {url} = useContext(Context)
  useEffect(() => {
    const fetchTables = async () => {
      const { data } = await axios.get(`${url}/api/tables`);
      setTables(data);
    };

    fetchTables();
  }, [url]);

    //Table show result **
    const showTable = tables
    .filter((table) => table.season === 2021)
    .sort((a,b) => a.position - b.position)
    .map((table, index) => (
      <tr className="tr-scale" key={index}>
        <td className="td-skew td__poz">{table.position}</td>
        <td className="td-skew td__club">
          <Link to={`/team/${table.team_name.split(' ')[1].toLowerCase()}`} style={{color: '#fff'}}>{table.team_name}</Link>
        </td>
        <td className="td-skew td__points">{table.points}</td>
        <td className="td-skew td__num">{table.match}</td>
        <td className="td-skew td__win">{table.win}</td>
        <td className="td-skew td__num">{table.draw}</td>
        <td className="td-skew td__lose">{table.lose}</td>
        <td className="td-skew td__num">{table.goal_plus}</td>
        <td className="td-skew td__num">{table.goal_minus}</td>
        <td className="td-skew td__num">{table.bilans}</td>
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
