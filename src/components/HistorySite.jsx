import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Table.scss";
import { table, oldTables } from "../data/table";
import { teams } from "../data/teams";
import axios from 'axios';
import "../styles/History.scss";
import { Prev } from "react-bootstrap/esm/PageItem";

function HistorySite() {
  const [seasonSelect, setSeasonSelect] = useState(2001);
  const [show, setShow] = useState(true);
  const [medalsTab, setMedalsTab] = useState([]);
  const [teams, setTeams] = useState([])
  const [tables, setTables] = useState([])
  const [matches, setMatches] = useState([])
  const [h2hTeamOne, setH2hTeamOne] = useState('')
  const [h2hTeamTwo, setH2hTeamTwo] = useState('')

  useEffect(() => {
    const fetchTeams = async () => {
      const { data } = await axios.get('/api/teams')
      console.log(data, 'Teams')
      setTeams(data)
    }
    const fetchTables = async () => {
      const {data} = await axios.get('/api/tables')
      setTables(data)
    }

    const fetchMatches = async () => {
      const {data} = await axios.get('/api/matches')
      setMatches(data)
    }

    fetchTeams()
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

  const optionTeams = teams.map((team, index) => (
    <option value={team.name} key={index}>
      {team.name}
    </option>
  ));

  //console.log(seasonArr, "after filter index");

  const selectSeason = (e) => {
    setSeasonSelect(e.target.value);
    setShow(!show);
  };

  const selectTeamOne = (e) => {
    setH2hTeamOne(e.target.value)
  };
  const selectTeamTwo = (e) => {
    setH2hTeamTwo(e.target.value)
  };

  //Show h2h
  let currentH2HStats = []
  useEffect(() => {
    currentH2HStats = []
  }, [h2hTeamOne])
  
  const showH2H = matches.filter(match => (match.host_name === h2hTeamOne && match.guest_name === h2hTeamTwo) || (match.host_name === h2hTeamTwo && match.guest_name === h2hTeamOne))
  .map(match =>{
    if(match.host_name === h2hTeamOne){
      currentH2HStats.push(
        {
          teamMatch: [match.host_name,match.guest_name, match.host_score, match.guest_score, match.season],
          teamOne: match.host_score, 
          teamTwo: match.guest_score, 
          teamOneWin: match.host_score > match.guest_score ? 1 : 0,
          teamOneDraw: match.host_score === match.guest_score ? 1 : 0,
          teamOneLose: match.host_score < match.guest_score ? 1 : 0,
          teamOneGoalPlus: match.host_score,
          teamOneGoalMinus: match.guest_score,
          teamTwoWin: match.host_score < match.guest_score ? 1 : 0,
          teamTwoDraw: match.host_score === match.guest_score ? 1 : 0,
          teamTwoLose: match.host_score > match.guest_score ? 1 : 0,
          teamTwoGoalPlus: match.guest_score,
          teamTwoGoalMinus: match.host_score,
        })
    }else if (match.host_name === h2hTeamTwo){
      currentH2HStats.push(
        {
          teamMatch: [match.guest_name,match.host_name, match.guest_score, match.host_score, match.season],
          teamOne: match.guest_score, 
          teamTwo: match.host_score, 
          teamOneWin: match.guest_score > match.host_score ? 1 : 0,
          teamOneDraw: match.guest_score === match.host_score ? 1 : 0,
          teamOneLose: match.guest_score < match.host_score ? 1 : 0,
          teamOneGoalPlus: match.guest_score,
          teamOneGoalMinus: match.host_score,
          teamTwoWin: match.guest_score < match.host_score ? 1 : 0,
          teamTwoDraw: match.guest_score === match.host_score ? 1 : 0,
          teamTwoLose: match.guest_score > match.host_score ? 1 : 0,
          teamTwoGoalPlus: match.host_score,
          teamTwoGoalMinus: match.guest_score,
        })
    }

   return (
    <tr>
      <td>{match.season}</td>
      <td>{match.host_name}</td>
      <td>{match.guest_name}</td>
      <td>{match.host_score}</td>
      <td>{match.guest_score}</td>
    </tr>
  )
})
console.log(currentH2HStats, 'show currentStats')
let currentStatsReduce = [
  {teamOneScores: currentH2HStats.map(team => team.teamOne)},
  {teamTwoScores: currentH2HStats.map(team => team.teamOne)},
]

const mapCurrentStats = currentH2HStats.filter(team => team.teamOne)
// .map(team => {
//   currentStatsReduce.push({
//     team
//   })
  
// })
console.log(mapCurrentStats, 'filter only one')
console.log(currentStatsReduce, 'show only team One')
//const showCurrentH2HStats = currentH2HStats.filter(team => team.teamOne).map(team => )

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
      // console.log("actual medals, index: ", index, "teamArr: ", medalsArr);
      // console.log("actual medals, index: ", index, "teamTab: ", medalsTab);
    });

  medalsArr.sort((a, b) => a.season - b.season || a.position - b.position);
  console.log("sorted", medalsArr);

  const medalsShow = medalsArr.map((team, index) => (
    <>
      {team.position === 1 ? (
        <tr>
          <td>{team.season}</td>
          {medalsArr.filter(item => team.season === item.season).map(team => (
            <td style={{
              color: `${
                team.position === 1 ? "gold" : team.position === 2 ? "silver" : "brown"
              }`,
            }}>
              <Link to={`/team/${team.name.split(' ')[1].toLowerCase()}`}>{team.name}</Link>
              </td>
          ))}
        </tr>
      ) : (
        ""
      )}
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
        <div className="sectionLine">
          <span className="sectionLine__title">H2H</span>
          <div className="container" style={{margin: '50px'}}>
            Team 1:
            <select onChange={selectTeamOne}>{optionTeams}</select>
            Team 2:
            <select onChange={selectTeamTwo}>{optionTeams}</select>
            <table className="table">
              {showH2H}
            </table>
          </div>
        </div>
      </section>
    </>
  );
}

export default HistorySite;
