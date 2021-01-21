import React, {useEffect, useState} from "react";
import Tilt from "react-tilt";
import { BsFillStarFill } from "react-icons/bs";
//import { teams } from "../data/teams";
import { oldTables } from "../data/table";
import { scores } from "../data/matches";
import axios from 'axios'

import "../styles/TeamSite.scss";

const TeamSite = (props) => {
  console.log(props.match.params.team);
  const teamSiteName = props.match.params.team;
  let teamTitle = "";

  const [teams, setTeams] = useState([])
  const [tables, setTables] = useState([])

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

    fetchTeams()
    fetchTables()
  }, [])


  //TEAM INFO ***
  teams.filter((team) =>
    team.site === teamSiteName ? (teamTitle = team.name) : ""
  );

  // First show current table for chosen team
  const showCurrentTeamTable = tables
  .filter(table => teamTitle === table.team_name)
  .filter(table => table.season === 2010)
  .map((team, index) => (
    <table className="table" key={index}>
          <tr>
            <th>Current Table</th>
          </tr>
          <tr>
            <td>Position: {team.position}</td>
          </tr>
          <tr>
            <td>Match: {team.match}</td>
          </tr>
          <tr>
            <td>Points: {team.points}</td>
          </tr>
          <tr>
            <td>Win: {team.win}</td>
          </tr>
          <tr>
            <td>Draw: {team.draw}</td>
          </tr>
          <tr>
            <td>Lost: {team.lose}</td>
          </tr>
          <tr>
            <td>Goal+: {team.goal_plus}</td>
          </tr>
          <tr>
            <td>Goal-: {team.goal_minus}</td>
          </tr>
          <tr>
            <td>Bilans: {team.bilans}</td>
          </tr>
        </table>
  ))
  console.log(showCurrentTeamTable, 'name in table')

  const showTeam = teams
  .filter((team) => team.site === teamSiteName)
  .map((team, index) => (
    <div className="team__info" key={index}>
      <div className="team__logo">
      <img src={team.logo} className="team__logo-img" />
      </div>
      
      <div className="team__table">
        {showCurrentTeamTable}
      </div>
    </div>
  ));



  const latestTable = tables.filter(table => teamTitle === table.team_name)

  // showTeam without fetch data
  // const showTeam = teams
  //   .filter((team) => team.site === teamSiteName)
  //   .map((team, index) => (
  //     <div className="team__info" key={index}>
  //       <div className="team__logo">{team.logo}</div>
  //       <div className="team__table">
  //         <table className="table">
  //           <tr>
  //             <th>Current Table</th>
  //           </tr>
  //           <tr>
  //             <td>Match: {team.table.match}</td>
  //           </tr>
  //           <tr>
  //             <td>Points: {team.table.points}</td>
  //           </tr>
  //           <tr>
  //             <td>Win: {team.table.win}</td>
  //           </tr>
  //           <tr>
  //             <td>Draw: {team.table.draw}</td>
  //           </tr>
  //           <tr>
  //             <td>Lost: {team.table.lost}</td>
  //           </tr>
  //           <tr>
  //             <td>Goal+:{team.table.goal_plus}</td>
  //           </tr>
  //           <tr>
  //             <td>Goal-:{team.table.goal_minus}</td>
  //           </tr>
  //           <tr>
  //             <td>Bilans:{team.table.bilans}</td>
  //           </tr>
  //         </table>
  //       </div>
  //     </div>
  //   ));

  //TROPHIES ***
  const showTrophies = oldTables
    .filter((team) => team.name === teamTitle)
    .map((team, index) => {
      if (team.place === 1 || team.place === 2 || team.place === 3) {
        return (
          <>
            <Tilt
              className="Tilt"
              options={{ max: 10 }}
              style={{ height: 250, width: 150, margin: 20, perspective: 1000 }}
            >
              <div className="trophy__card">
                <div
                  className="trophy__star"
                  style={{
                    color: `${
                      team.place === 1
                        ? "gold"
                        : team.place === 2
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
                      team.place === 1
                        ? "gold"
                        : team.place === 2
                        ? "silver"
                        : "brown"
                    }`,
                  }}
                ></div>
                <div
                  className="trophy__year"
                  style={{
                    color: `${
                      team.place === 1
                        ? "gold"
                        : team.place === 2
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
  const fixtures = scores
    .filter(
      (team) => team.host.name === teamTitle || team.guest.name === teamTitle
    )
    .map((score, index) => (
      <tr key={index}>
        <td className="td__round">{score.round}</td>
        <td className="td__host-name">{score.host.name}</td>
        <td className="td__host-score">{score.host.score}</td>
        <td className="td__guest-score">{score.guest.score}</td>
        <td className="td__guest-name">{score.guest.name}</td>
        <td className="td__date">{score.date}</td>
      </tr>
    ));

  //SEASON HISTORY **
  const showSeasons = oldTables
    .filter((team) => team.name === teamTitle)
    .map((team, index) => (
      <tr>
        <td className="td__poz">{team.place}</td>
        <td className="td__club">{team.name}</td>
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
            <table className="table">
              <tr>
                <th>R</th>
                <th>Host</th>
                <th>SH</th>
                <th>SG</th>
                <th>Guest</th>
                <th>Date</th>
              </tr>
              {fixtures}
            </table>
          </div>
        </div>
      </section>

      <section id="seasons">
        <div className="sectionLine">
          <span className="sectionLine__title">Latest Seasons</span>
        </div>
        <div className="container">
          <table className="table">{showSeasons}</table>
        </div>
      </section>
    </main>
  );
}

export default TeamSite;
