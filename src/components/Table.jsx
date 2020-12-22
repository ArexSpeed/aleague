import React from "react";
import { Link } from "react-router-dom";
import "../styles/Table.scss";
import { table } from "../data/table";
import { teams } from "../data/teams";

function Table() {
  const tablemap = teams.map((team, index) => (
    <tr>
      <td className="td__poz">{index + 1}</td>
      <td className="td__club">
        <Link to={`/team/${team.site}`}>{team.name}</Link>
      </td>
      <td className="td__points">{team.table.points}</td>
      <td className="td__num">{team.table.match}</td>
      <td className="td__num">{team.table.win}</td>
      <td className="td__num">{team.table.draw}</td>
      <td className="td__num">{team.table.lost}</td>
      <td className="td__num">{team.table.goal_plus}</td>
      <td className="td__num">{team.table.goal_minus}</td>
      <td className="td__num">{team.table.bilans}</td>
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
      {tablemap}
    </table>
  );
}

export default Table;
