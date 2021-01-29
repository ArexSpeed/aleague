import React, {useEffect, useState} from "react";
import Tilt from "react-tilt";
import { BsFillStarFill } from "react-icons/bs";
import Footer from './Footer'
import axios from 'axios'

import "../styles/TeamSite.scss";

const TeamSite = (props) => {
  console.log(props.match.params.team);
  const teamSiteName = props.match.params.team;
  let teamTitle = "";

  const [teams, setTeams] = useState([])
  const [tables, setTables] = useState([])
  const [matches, setMatches] = useState([])
  const [fixtures, setFixtures] = useState(true)

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


  //TEAM INFO ***
  teams.filter((team) =>
    team.site === teamSiteName ? (teamTitle = team.name) : ""
  );

  // First show current table for chosen team
  const showCurrentTeamTable = tables
  .filter(table => teamTitle === table.team_name)
  .filter(table => table.season === 2021)
  .map((team, index) => (
    <table className="table" style={{textAlign: 'center'}} key={index}>
          <tr>
            <th>Current Table</th>
          </tr>
          <tr>
            <td className='td-skew'>Position: {team.position}</td>
          </tr>
          <tr>
            <td className='td-skew'>Match: {team.match}</td>
          </tr>
          <tr>
            <td className='td-skew'>Points: {team.points}</td>
          </tr>
          <tr>
            <td className='td-skew'>Win: {team.win}</td>
          </tr>
          <tr>
            <td className='td-skew'>Draw: {team.draw}</td>
          </tr>
          <tr>
            <td className='td-skew'>Lost: {team.lose}</td>
          </tr>
          <tr>
            <td className='td-skew'>Goal+: {team.goal_plus}</td>
          </tr>
          <tr>
            <td className='td-skew'>Goal-: {team.goal_minus}</td>
          </tr>
          <tr>
            <td className='td-skew'>Bilans: {team.bilans}</td>
          </tr>
        </table>
  ))
  console.log(showCurrentTeamTable, 'name in table')

  const showTeam = teams
  .filter((team) => team.site === teamSiteName)
  .map((team, index) => (
    <div className="team__info" key={index}>
      <div className="team__logo">
      <img src={team.logo} className="team__logo-img" alt="logo" />
      </div>
      
      <div className="team__table">
        {showCurrentTeamTable}
      </div>
    </div>
  ));


  //TROPHIES ***
  const showTrophies = tables
    .filter((table) => table.team_name === teamTitle && table.season !== 2021)
    .sort((a,b) => a.season-b.season)
    .map((team, index) => {
      if (team.position === 1 || team.position === 2 || team.position === 3) {
        return (
          <>
            <Tilt
              className="Tilt"
              options={{ max: 10 }}
              style={{ height: 250, width: 150, margin: 20, perspective: 1000 }}
            >
              <div className="trophy__card" key={index}>
                <div
                  className="trophy__star"
                  style={{
                    color: `${
                      team.position === 1
                        ? "gold"
                        : team.position === 2
                        ? "silver"
                        : "brown"
                    }`,
                  }}
                >
                  <BsFillStarFill
                    style={{
                      width: "100px",
                      fontSize: "100px",
                    }}
                  />
                </div>
                <div
                  className="trophy__line"
                  style={{
                    backgroundColor: `${
                      team.position === 1
                        ? "gold"
                        : team.position === 2
                        ? "silver"
                        : "brown"
                    }`,
                  }}
                ></div>
                <div
                  className="trophy__year"
                  style={{
                    color: `${
                      team.position === 1
                        ? "gold"
                        : team.position === 2
                        ? "silver"
                        : "brown"
                    }`,
                  }}
                >
                  {team.season}
                </div>
              </div>
            </Tilt>
          </>
        );
      }
    });
  // FIXTURES ***
  const playedMatches = matches
    .filter(
      (match) => match.host_name === teamTitle || match.guest_name === teamTitle
    )
    .filter((match) => match.season === 2021 && match.round <=15)
    .sort((a,b) => a.round - b.round)
    .map((match, index) => (
        <tr key={index}>
        <td className="td-skew td__round">{match.round}</td>
        <td className="td-skew td__host-name">{match.host_name}</td>
        <td className="td-skew td__host-score">{match.host_score}</td>
        <td className="td-skew td__guest-score">{match.guest_score}</td>
        <td className="td-skew td__guest-name">{match.guest_name}</td>
      </tr>
    ));

    const upcomingMatches = matches
    .filter(
      (match) => match.host_name === teamTitle || match.guest_name === teamTitle
    )
    .filter((match) => match.season === 2021 && match.round >15)
    .sort((a,b) => a.round - b.round)
    .map((match, index) => (
        <tr key={index}>
        <td className="td-skew td__round">{match.round}</td>
        <td className="td-skew td__host-name">{match.host_name}</td>
        <td className="td-skew td__host-score">{match.host_score}</td>
        <td className="td-skew td__guest-score">{match.guest_score}</td>
        <td className="td-skew td__guest-name">{match.guest_name}</td>
      </tr>
    ));

  // SHOW LATEST TABLE ***
  let sumTableArr = []
  const latestSeasons = tables
  .filter(table => teamTitle === table.team_name)
  .sort((a,b) => a.season - b.season)
  .map((team, index) => {
    sumTableArr.push({
      teamPoints: team.points,
      teamMatch: team.match,
      teamWin: team.win,
      teamDraw: team.draw,
      teamLose: team.lose,
      teamGoalPlus: team.goal_plus,
      teamGoalMinus: team.goal_minus,
      teamBilans: team.bilans
    })

    return (
      <tr key={index} className="tr-scale">
          <td className="td-skew td__poz">{team.season}</td>
          <td className="td-skew td__poz">{team.position}</td>
          <td className="td-skew td__club">{team.team_name}</td>
          <td className="td-skew td__points">{team.points}</td>
          <td className="td-skew">{team.match}</td>
          <td className="td-skew td__win">{team.win}</td>
          <td className="td-skew">{team.draw}</td>
          <td className="td-skew td__lose">{team.lose}</td>
          <td className="td-skew">{team.goal_plus}</td>
          <td className="td-skew">{team.goal_minus}</td>
          <td className="td-skew">{team.bilans}</td>
        </tr>
    )
  } )

  //SHOW SUM TABLE **
  const showSumTable = (
    <>
      <tr>
          <td className="td-skew td__poz">All time</td>
          <td className="td-skew td__poz"></td>
          <td className="td-skew td__club">{teamTitle}</td>
          <td className="td-skew td__points">{sumTableArr.length > 1 && sumTableArr.map(team => team.teamPoints).reduce((a,b) => a+b)}</td>
          <td className="td-skew">{sumTableArr.length > 1 && sumTableArr.map(team => team.teamMatch).reduce((a,b) => a+b)}</td>
          <td className="td-skew td__win">{sumTableArr.length > 1 && sumTableArr.map(team => team.teamWin).reduce((a,b) => a+b)}</td>
          <td className="td-skew">{sumTableArr.length > 1 && sumTableArr.map(team => team.teamDraw).reduce((a,b) => a+b)}</td>
          <td className="td-skew td__lose">{sumTableArr.length > 1 && sumTableArr.map(team => team.teamLose).reduce((a,b) => a+b)}</td>
          <td className="td-skew">{sumTableArr.length > 1 && sumTableArr.map(team => team.teamGoalPlus).reduce((a,b) => a+b)}</td>
          <td className="td-skew">{sumTableArr.length > 1 && sumTableArr.map(team => team.teamGoalMinus).reduce((a,b) => a+b)}</td>
          <td className="td-skew">{sumTableArr.length > 1 && sumTableArr.map(team => team.teamBilans).reduce((a,b) => a+b)}</td>
          
        </tr>
        <tr></tr>
    </>
  )
  return (
    <main className="main">
      <section id="info">
        <div className="sectionLine">
          <span className="sectionLine__title">{teamTitle}</span>
        </div>
        <div className="container">{showTeam}</div>
      </section>

      <section id="trophy">
        <div className="sectionLine">
          <span className="sectionLine__title">Trophies</span>
        </div>
        <div className="container">{showTrophies}</div>
      </section>

      <section id="fixtures">
        <div className="sectionLine">
          <span className="sectionLine__title">Fixtures</span>
        </div>
        <div className="container">
          <div className="fixtures__schedule">
          <div className="switch">
            <div className={fixtures ? 'switch-on' : 'switch-off'} onClick={() => setFixtures(true)}>Played</div>
          <div className={!fixtures ?'switch-on' : 'switch-off'} onClick={() => setFixtures(false)}>Upcoming</div>
            </div>
          
            <table className="table">
              <tr>
                <th>R</th>
                <th>Host</th>
                <th>SH</th>
                <th>SG</th>
                <th>Guest</th>
              </tr>
              {fixtures ? playedMatches : upcomingMatches}
            </table>
          </div>
        </div>
      </section>

      <section id="seasons">
        <div className="sectionLine">
          <span className="sectionLine__title">Latest Seasons</span>
        </div>
        <div className="container">
          
          <table className="table">
          <tr>
        <td>S</td>
        <td>Pos</td>
        <td>Team</td>
        <td className="td__points">Pts</td>
        <td>M</td>
        <td>W</td>
        <td>D</td>
        <td>L</td>
        <td>G+</td>
        <td>G-</td>
        <td>Bil</td>
      </tr>
      {showSumTable}
      {latestSeasons}</table>
        </div>
      </section>
      <Footer />
    </main>
  );
}

export default TeamSite;
