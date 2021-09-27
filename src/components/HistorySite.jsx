// import React, { useState, useEffect, useContext } from "react";
// import { Link } from "react-router-dom";
// import "../styles/Table.scss";
// import axios from 'axios';
// import "../styles/History.scss";
// import {Context} from '../context'
// import Loader from "./Loader";

// function HistorySite() {
//   const [loading, setLoading] = useState(false);
//   const [seasonSelect, setSeasonSelect] = useState(2020);
//   const [show, setShow] = useState(true);
//   const [teams, setTeams] = useState([]);
//   const [tables, setTables] = useState([]);
//   const [matches, setMatches] = useState([]);
//   const [h2hTeamOne, setH2hTeamOne] = useState("");
//   const [h2hTeamTwo, setH2hTeamTwo] = useState("");
//   const { url } = useContext(Context);

//   useEffect(() => {
//     setLoading(true);
//     const fetchTeams = async () => {
//       const { data } = await axios.get(`${url}/api/teams`);
//       setTeams(data);
//     };
//     const fetchTables = async () => {
//       const { data } = await axios.get(`${url}/api/tables`);
//       setTables(data);
//     };

//     const fetchMatches = async () => {
//       const { data } = await axios.get(`${url}/api/matches`);
//       setLoading(false);
//       setMatches(data);
//     };

//     fetchTeams();
//     fetchTables();
//     fetchMatches();
//   }, [url]);

//   //Table seasons choose ***
//   let seasonArr = [];
//   tables
//     .filter((table) => table.season !== 2021)
//     .map((table) => seasonArr.push(table.season));
//   seasonArr = seasonArr.filter(
//     (item, index, aref) => aref.indexOf(item) === index
//   );
//   const optionSeason = seasonArr
//     .sort((a, b) => b - a)
//     .map((season, index) => (
//       <option value={season} key={index}>
//         {season}
//       </option>
//     ));

//   const optionTeams = teams.map((team, index) => (
//     <option value={team.name} key={index}>
//       {team.name}
//     </option>
//   ));

//   //console.log(seasonArr, "after filter index");

//   const selectSeason = (e) => {
//     setSeasonSelect(e.target.value);
//     setShow(!show);
//   };

//   const selectTeamOne = (e) => {
//     setH2hTeamOne(e.target.value);
//   };
//   const selectTeamTwo = (e) => {
//     setH2hTeamTwo(e.target.value);
//   };

//   //Show h2h
//   let currentH2HStats = [];
//   useEffect(() => {
//     currentH2HStats = [];
//   }, [h2hTeamOne]);

//   const showH2H = matches
//     .filter(
//       (match) =>
//         (match.host_name === h2hTeamOne && match.guest_name === h2hTeamTwo) ||
//         (match.host_name === h2hTeamTwo && match.guest_name === h2hTeamOne)
//     )
//     .sort((a, b) => a.season - b.season)
//     .map((match) => {
//       if (match.host_name === h2hTeamOne) {
//         currentH2HStats.push({
//           teamMatch: [
//             match.host_name,
//             match.guest_name,
//             match.host_score,
//             match.guest_score,
//             match.season,
//           ],
//           teamOneScore: match.host_score,
//           teamTwoScore: match.guest_score,
//           teamOneWin: match.host_score > match.guest_score ? 1 : 0,
//           teamOneDraw: match.host_score === match.guest_score ? 1 : 0,
//           teamOneLose: match.host_score < match.guest_score ? 1 : 0,
//           teamOneGoalPlus: match.host_score,
//           teamOneGoalMinus: match.guest_score,
//           teamTwoWin: match.host_score < match.guest_score ? 1 : 0,
//           teamTwoDraw: match.host_score === match.guest_score ? 1 : 0,
//           teamTwoLose: match.host_score > match.guest_score ? 1 : 0,
//           teamTwoGoalPlus: match.guest_score,
//           teamTwoGoalMinus: match.host_score,
//         });
//       } else if (match.host_name === h2hTeamTwo) {
//         currentH2HStats.push({
//           teamMatch: [
//             match.guest_name,
//             match.host_name,
//             match.guest_score,
//             match.host_score,
//             match.season,
//           ],
//           teamOneScore: match.guest_score,
//           teamTwoScore: match.host_score,
//           teamOneWin: match.guest_score > match.host_score ? 1 : 0,
//           teamOneDraw: match.guest_score === match.host_score ? 1 : 0,
//           teamOneLose: match.guest_score < match.host_score ? 1 : 0,
//           teamOneGoalPlus: match.guest_score,
//           teamOneGoalMinus: match.host_score,
//           teamTwoWin: match.guest_score < match.host_score ? 1 : 0,
//           teamTwoDraw: match.guest_score === match.host_score ? 1 : 0,
//           teamTwoLose: match.guest_score > match.host_score ? 1 : 0,
//           teamTwoGoalPlus: match.host_score,
//           teamTwoGoalMinus: match.guest_score,
//         });
//       }

//       return (
//         <tr>
//           <td className="td-skew">{match.season}</td>
//           <td
//             className={
//               h2hTeamOne === match.host_name
//                 ? "td__teamOneH2H"
//                 : "td__teamTwoH2H"
//             }
//           >
//             {match.host_name}
//           </td>
//           <td
//             className={
//               h2hTeamTwo === match.host_name
//                 ? "td__teamOneH2H"
//                 : "td__teamTwoH2H"
//             }
//           >
//             {match.guest_name}
//           </td>
//           <td className="td-skew">{match.host_score}</td>
//           <td className="td-skew">{match.guest_score}</td>
//         </tr>
//       );
//     });
//   //console.log(currentH2HStats, 'show currentStats')
//   let currentStatsReduce = [
//     { teamOneScores: currentH2HStats.map((team) => team.teamOneScore) },
//     { teamTwoScores: currentH2HStats.map((team) => team.teamTwoScore) },
//     { teamOneWin: currentH2HStats.map((team) => team.teamOneWin) },
//     { teamOneDraw: currentH2HStats.map((team) => team.teamOneDraw) },
//     { teamOneLose: currentH2HStats.map((team) => team.teamOneLose) },
//     { teamOneGoalPlus: currentH2HStats.map((team) => team.teamOneGoalPlus) },
//     { teamOneGoalMinus: currentH2HStats.map((team) => team.teamOneGoalMinus) },
//     { teamTwoWin: currentH2HStats.map((team) => team.teamTwoWin) },
//     { teamTwoDraw: currentH2HStats.map((team) => team.teamTwoDraw) },
//     { teamTwoLose: currentH2HStats.map((team) => team.teamTwoLose) },
//     { teamTwoGoalPlus: currentH2HStats.map((team) => team.teamTwoGoalPlus) },
//     { teamTwoGoalMinus: currentH2HStats.map((team) => team.teamTwoGoalMinus) },
//   ];

//   const showH2HStats = (
//     <>
//       <tr>
//         <td className="td__teamOneH2H">
//           {currentH2HStats.length > 1 &&
//             currentStatsReduce
//               .find((x) => x.teamOneScores)
//               .teamOneScores.reduce((a, b) => a + b)}
//         </td>
//         <td className="td-skew td__H2H-stats">Goals</td>
//         <td className="td__teamTwoH2H">
//           {currentH2HStats.length > 1 &&
//             currentStatsReduce
//               .find((x) => x.teamTwoScores)
//               .teamTwoScores.reduce((a, b) => a + b)}
//         </td>
//       </tr>
//       <tr>
//         <td className="td__teamOneH2H">
//           {currentH2HStats.length > 1 &&
//             currentStatsReduce
//               .find((x) => x.teamOneWin)
//               .teamOneWin.reduce((a, b) => a + b)}
//         </td>
//         <td className="td-skew td__H2H-stats">Win</td>
//         <td className="td__teamTwoH2H">
//           {currentH2HStats.length > 1 &&
//             currentStatsReduce
//               .find((x) => x.teamTwoWin)
//               .teamTwoWin.reduce((a, b) => a + b)}
//         </td>
//       </tr>
//       <tr>
//         <td className="td__teamOneH2H">
//           {currentH2HStats.length > 1 &&
//             currentStatsReduce
//               .find((x) => x.teamOneDraw)
//               .teamOneDraw.reduce((a, b) => a + b)}
//         </td>
//         <td className="td-skew td__H2H-stats">Draw</td>
//         <td className="td__teamTwoH2H">
//           {currentH2HStats.length > 1 &&
//             currentStatsReduce
//               .find((x) => x.teamTwoDraw)
//               .teamTwoDraw.reduce((a, b) => a + b)}
//         </td>
//       </tr>
//       <tr>
//         <td className="td__teamOneH2H">
//           {currentH2HStats.length > 1 &&
//             currentStatsReduce
//               .find((x) => x.teamOneLose)
//               .teamOneLose.reduce((a, b) => a + b)}
//         </td>
//         <td className="td-skew td__H2H-stats">Lose</td>
//         <td className="td__teamTwoH2H">
//           {currentH2HStats.length > 1 &&
//             currentStatsReduce
//               .find((x) => x.teamTwoLose)
//               .teamTwoLose.reduce((a, b) => a + b)}
//         </td>
//       </tr>
//     </>
//   );

//   //console.log(currentStatsReduce, 'show only team One')

//   //Table show result **
//   const showTable = tables
//     .filter((table) => table.season === Number(seasonSelect))
//     .sort((a, b) => a.position - b.position)
//     .map((table, index) => (
//       <tr
//         className={show ? "tr__motion" : "tr__motionb"}
//         style={{ animationDelay: `${index / 2}s` }}
//       >
//         <td className="td-skew td__poz">{table.position}</td>
//         <td className="td-skew td__club">
//           <Link
//             to={`/team/${table.team_name.split(" ")[1].toLowerCase()}`}
//             style={{ color: "#fff" }}
//           >
//             {table.team_name}
//           </Link>
//         </td>
//         <td className="td-skew td__points">{table.points}</td>
//         <td className="td-skew">{table.match}</td>
//         <td className="td-skew td__win">{table.win}</td>
//         <td className="td-skew">{table.draw}</td>
//         <td className="td-skew td__lose">{table.lose}</td>
//         <td className="td-skew">{table.goal_plus}</td>
//         <td className="td-skew">{table.goal_minus}</td>
//         <td className="td-skew">{table.bilans}</td>
//       </tr>
//     ));
//   // Medals *****
//   const medalsArr = [];
//   const medals = tables
//     .filter(
//       (team) =>
//         (team.position === 1 || team.position === 2 || team.position === 3) &&
//         team.season !== 2021
//     )
//     .map((team, index) => {
//       medalsArr.push({
//         season: team.season,
//         position: team.position,
//         name: team.team_name,
//         points: team.points,
//       });
//     });

//   medalsArr.sort((a, b) => a.season - b.season || a.position - b.position);

//   const medalsShow = medalsArr.map((team, index) => (
//     <>
//       {team.position === 1 ? (
//         <tr>
//           <td className="td-skew">{team.season}</td>
//           {medalsArr
//             .filter((item) => team.season === item.season)
//             .map((team) => (
//               <td
//                 className={
//                   team.position === 1
//                     ? "td__gold"
//                     : team.position === 2
//                     ? "td__silver"
//                     : "td__brown"
//                 }
//               >
//                 <Link
//                   to={`/team/${team.name.split(" ")[1].toLowerCase()}`}
//                   style={{ color: "#fff" }}
//                 >
//                   {team.name}
//                 </Link>
//               </td>
//             ))}
//         </tr>
//       ) : (
//         ""
//       )}
//     </>
//   ));

//   // Medals Table
//   let medalTables = [];
//   teams.map((team) =>
//     medalTables.push({
//       name: team.name,
//       first: 0,
//       second: 0,
//       third: 0,
//     })
//   );

//   medalsArr.forEach((table) => {
//     const found = medalTables.find((team) => team.name === table.name);
//     switch (table.position) {
//       case 1:
//         found.first++;
//         break;
//       case 2:
//         found.second++;
//         break;
//       case 3:
//         found.third++;
//         break;
//       default:
//         break;
//     }
//   });
//   //console.log('medalTable sorted', medalTables)
//   medalTables.sort(
//     (a, b) => b.first - a.first || b.second - a.second || b.third - a.third
//   );
//   const showMedalTable = medalTables.map((team, index) => (
//     <tr key={index}>
//       <td className="td-skew">{index + 1}</td>
//       <td className="td-skew">{team.name}</td>
//       <td className="td-skew td__gold">{team.first}</td>
//       <td className="td-skew td__silver">{team.second}</td>
//       <td className="td-skew td__brown">{team.third}</td>
//     </tr>
//   ));

//   return (
//     <>
//       <section>
//         <div className="sectionLine">
//           <span className="sectionLine__title">Table</span>
//         </div>
//         <div className="containerTable">
//           {loading ? (
//             <Loader text="content" />
//           ) : (
//             <>
//               <div className="fixtures__select">
//                 Season:
//                 <select onChange={selectSeason}>{optionSeason}</select>
//               </div>
//               <table className="table">
//                 <tr>
//                   <th>Poz</th>
//                   <th>Club</th>
//                   <th>PTS</th>
//                   <th>M</th>
//                   <th>W</th>
//                   <th>D</th>
//                   <th>L</th>
//                   <th>G+</th>
//                   <th>G-</th>
//                   <th>Bil</th>
//                 </tr>
//                 {showTable}
//               </table>
//             </>
//           )}
//         </div>
//       </section>
//       <section>
//         <div className="sectionLine">
//           <span className="sectionLine__title">Medals</span>
//         </div>
//         {loading ? (
//           <Loader text="medals" />
//         ) : (
//           <div className="containerTable">
//             <table className="table">{medalsShow}</table>
//             <table className="table">{showMedalTable}</table>
//           </div>
//         )}
//       </section>
//       <section>
//         <div className="sectionLine">
//           <span className="sectionLine__title">H2H</span>
//         </div>
//         <div className="containerTable">
//           <div className="fixtures__select">
//             <select onChange={selectTeamOne}>{optionTeams}</select>
//           </div>
//           <div className="fixtures__select">
//             <select onChange={selectTeamTwo}>{optionTeams}</select>
//           </div>
//           <div className="h2hStats">
//             {teams
//               .filter((team) => team.name === h2hTeamOne)
//               .map((team) => (
//                 <img className="h2hStats__logo" src={team.logo} alt="" />
//               ))}
//             <div className="h2hStats__table">{showH2HStats}</div>
//             {teams
//               .filter((team) => team.name === h2hTeamTwo)
//               .map((team) => (
//                 <img className="h2hStats__logo" src={team.logo} alt="" />
//               ))}
//           </div>

//           <table className="table">{showH2H}</table>
//         </div>
//       </section>
//     </>
//   );
// }

// export default HistorySite;
