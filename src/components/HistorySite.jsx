import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Table.scss";
import { table, oldTables } from "../data/table";
import { teams } from "../data/teams";
import axios from 'axios';
import "../styles/History.scss";
import { Prev } from "react-bootstrap/esm/PageItem";

function HistorySite() {
  const [seasonSelect, setSeasonSelect] = useState(2010);
  const [show, setShow] = useState(true);
  const [medalsTab, setMedalsTab] = useState([]);

  const [tables, setTables] = useState([])
  const [matches, setMatches] = useState([])

  useEffect(() => {

    const fetchTables = async () => {
      const {data} = await axios.get('/api/tables')
      setTables(data)
    }

    const fetchMatches = async () => {
      const {data} = await axios.get('/api/matches')
      setMatches(data)
    }

    fetchTables()
    fetchMatches()
  }, [])

  //Table seasons choose ***
  let seasonArr = [];
  tables.map((table) =>
    seasonArr.push(table.season)
  );
  seasonArr = seasonArr.filter(
    (item, index, aref) => aref.indexOf(item) === index
  );
  const optionSeason = seasonArr.map((season, index) => (
    <option value={season} key={index}>
      {season}
    </option>
  ));

  console.log(seasonArr, "after filter index");
  useEffect(() => {}, []);

  const selectSeason = (e) => {
    setSeasonSelect(e.target.value);
    setShow(!show);
  };

  //Table show result **
  const tablemap = tables
    .filter((table) => table.season === Number(seasonSelect))
    .map((table, index) => (
      <tr
        className={show ? "tr__motion" : "tr__motionb"}
        style={{ animationDelay: `${index / 2}s` }}
      >
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
  // Medals *****
  const medalsArr = [];
  const medals = tables
    .filter((team) => team.position === 1 || team.position === 2 || team.position === 3)
    .map((team, index) => {
      medalsArr.push({
        season: team.season,
        position: team.position,
        name: team.team_name,
        points: team.points,
      });
      //setMedalsTab(...medalsTab, medalsArr);
      console.log("actual medals, index: ", index, "teamArr: ", medalsArr);
      console.log("actual medals, index: ", index, "teamTab: ", medalsTab);
    });

  medalsArr.sort((a, b) => a.season - b.season || a.place - b.place);
  console.log("sorted", medalsArr);
  const medalsShow = medalsArr.map((team, index) => (
    <>
      {team.position === 1 ? (
        <tr>
          <td>{team.season}</td>
        </tr>
      ) : (
        ""
      )}

      <tr
        style={{
          color: `${
            team.position === 1 ? "gold" : team.position === 2 ? "silver" : "brown"
          }`,
        }}
      >
        <td>{team.position}</td>
        <td className="td__club">
          <Link to={`/team/${team.name.split(' ')[1].toLowerCase()}`}>{team.name}</Link>
        </td>
      </tr>
    </>
  ));

  return (
    <>
      <section>
        <div className="sectionLine">
          <span className="sectionLine__title">Table</span>
        </div>
        <div className="container">
          <div className="fixtures__select">
            Season:
            <select onChange={selectSeason}>{optionSeason}</select>
          </div>
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
        </div>
        <div className="sectionLine">
          <span className="sectionLine__title">Medals</span>
        </div>
        <div className="container">
          <table className="table">{medalsShow}</table>
        </div>
      </section>
    </>
  );
}

export default HistorySite;
