import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Table.scss";
import { table, oldTables } from "../data/table";
import { teams } from "../data/teams";

import "../styles/History.scss";
import { Prev } from "react-bootstrap/esm/PageItem";

function HistorySite() {
  const [seasonSelect, setSeasonSelect] = useState(2010);
  const [show, setShow] = useState(true);
  const [medalsTab, setMedalsTab] = useState([]);

  let seasonArr = [];
  const seasonSetArr = oldTables.map((season, index) =>
    seasonArr.push(season.season)
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

  const tablemap = oldTables
    .filter((season) => season.season === Number(seasonSelect))
    .map((team, index) => (
      <tr
        className={show ? "tr__motion" : "tr__motionb"}
        style={{ animationDelay: `${index / 2}s` }}
      >
        <td className="td__poz">{team.place}</td>
        <td className="td__club">
          <Link to={`/team/${team.site}`}>{team.name}</Link>
        </td>
        <td className="td__points">{team.points}</td>
        <td className="td__num">{team.match}</td>
        <td className="td__num">{team.win}</td>
        <td className="td__num">{team.draw}</td>
        <td className="td__num">{team.lost}</td>
        <td className="td__num">{team.goal_plus}</td>
        <td className="td__num">{team.goal_minus}</td>
        <td className="td__num">{team.bilans}</td>
      </tr>
    ));
  // Medals *****
  const medalsArr = [];
  const medals = oldTables
    .filter((team) => team.place === 1 || team.place === 2 || team.place === 3)
    .map((team, index) => {
      medalsArr.push({
        season: team.season,
        place: team.place,
        name: team.name,
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
      {team.place === 1 ? (
        <tr>
          <td>{team.season}</td>
        </tr>
      ) : (
        ""
      )}

      <tr
        style={{
          color: `${
            team.place === 1 ? "gold" : team.place === 2 ? "silver" : "brown"
          }`,
        }}
      >
        <td>{team.place}</td>
        <td className="td__club">
          <Link to={`/team/${team.site}`}>{team.name}</Link>
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
