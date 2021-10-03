import { useState, useContext } from "react";
import useTeams from "../hooks/useTeams";
import useMatches from "../hooks/useMatches";
import { Context } from "../context/Provider";

const H2H = () => {
  const { teams } = useTeams();
  const { matches } = useMatches();
  const [{ darkTheme }] = useContext(Context);
  const [teamOne, setTeamOne] = useState("");
  const [teamTwo, setTeamTwo] = useState("");

  //Show h2h
  let currentH2HStats = [];

  const showH2H = matches
    ?.filter(
      (match) =>
        (match.host_name === teamOne && match.guest_name === teamTwo) ||
        (match.host_name === teamTwo && match.guest_name === teamOne)
    )
    .sort((a, b) => a.season - b.season)
    .map((match) => {
      if (match.host_name === teamOne) {
        currentH2HStats.push({
          teamMatch: [
            match.host_name,
            match.guest_name,
            match.host_score,
            match.guest_score,
            match.season,
          ],
          teamOneScore: match.host_score,
          teamTwoScore: match.guest_score,
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
        });
      } else if (match.host_name === teamTwo) {
        currentH2HStats.push({
          teamMatch: [
            match.guest_name,
            match.host_name,
            match.guest_score,
            match.host_score,
            match.season,
          ],
          teamOneScore: match.guest_score,
          teamTwoScore: match.host_score,
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
        });
      }

      return (
        <tr>
          <td className={darkTheme && "dark"}>{match.season}</td>
          <td
            className={`${
              teamOne === match.host_name ? "td__hostName" : "td__guestName"
            } ${darkTheme && "dark"}`}
          >
            {match.host_name}
          </td>
          <td className={`${darkTheme && "dark"}`}>
            <div className={`td__hostScore ${darkTheme && "dark"}`}>
              {match.host_score}
            </div>
          </td>
          <td className={`${darkTheme && "dark"}`}>
            <div className={`td__guestScore ${darkTheme && "dark"}`}>
              {match.guest_score}
            </div>
          </td>
          <td
            className={`${
              teamOne === match.guest_name ? "td__hostName" : "td__guestName"
            } ${darkTheme && "dark"}`}
          >
            {match.guest_name}
          </td>
        </tr>
      );
    });

  let currentStatsReduce = [
    { teamOneScores: currentH2HStats.map((team) => team.teamOneScore) },
    { teamTwoScores: currentH2HStats.map((team) => team.teamTwoScore) },
    { teamOneWin: currentH2HStats.map((team) => team.teamOneWin) },
    { teamOneDraw: currentH2HStats.map((team) => team.teamOneDraw) },
    { teamOneLose: currentH2HStats.map((team) => team.teamOneLose) },
    { teamOneGoalPlus: currentH2HStats.map((team) => team.teamOneGoalPlus) },
    { teamOneGoalMinus: currentH2HStats.map((team) => team.teamOneGoalMinus) },
    { teamTwoWin: currentH2HStats.map((team) => team.teamTwoWin) },
    { teamTwoDraw: currentH2HStats.map((team) => team.teamTwoDraw) },
    { teamTwoLose: currentH2HStats.map((team) => team.teamTwoLose) },
    { teamTwoGoalPlus: currentH2HStats.map((team) => team.teamTwoGoalPlus) },
    { teamTwoGoalMinus: currentH2HStats.map((team) => team.teamTwoGoalMinus) },
  ];

  const showH2HStats = (
    <>
      <tr>
        <td className={`h2h__table-td_teamOne ${darkTheme && "dark"}`}>
          {currentH2HStats.length > 1 &&
            currentStatsReduce
              .find((x) => x.teamOneScores)
              .teamOneScores.reduce((a, b) => a + b)}
        </td>
        <td className={`h2h__table-td_title ${darkTheme && "dark"}`}>Goals</td>
        <td className={`h2h__table-td_teamTwo ${darkTheme && "dark"}`}>
          {currentH2HStats.length > 1 &&
            currentStatsReduce
              .find((x) => x.teamTwoScores)
              .teamTwoScores.reduce((a, b) => a + b)}
        </td>
      </tr>
      <tr>
        <td className={`h2h__table-td_teamOne ${darkTheme && "dark"}`}>
          {currentH2HStats.length > 1 &&
            currentStatsReduce
              .find((x) => x.teamOneWin)
              .teamOneWin.reduce((a, b) => a + b)}
        </td>
        <td className={`h2h__table-td_title ${darkTheme && "dark"}`}>Win</td>
        <td className={`h2h__table-td_teamTwo ${darkTheme && "dark"}`}>
          {currentH2HStats.length > 1 &&
            currentStatsReduce
              .find((x) => x.teamTwoWin)
              .teamTwoWin.reduce((a, b) => a + b)}
        </td>
      </tr>
      <tr>
        <td className={`h2h__table-td_teamOne ${darkTheme && "dark"}`}>
          {currentH2HStats.length > 1 &&
            currentStatsReduce
              .find((x) => x.teamOneDraw)
              .teamOneDraw.reduce((a, b) => a + b)}
        </td>
        <td className={`h2h__table-td_title ${darkTheme && "dark"}`}>Draw</td>
        <td className={`h2h__table-td_teamTwo ${darkTheme && "dark"}`}>
          {currentH2HStats.length > 1 &&
            currentStatsReduce
              .find((x) => x.teamTwoDraw)
              .teamTwoDraw.reduce((a, b) => a + b)}
        </td>
      </tr>
      <tr>
        <td className={`h2h__table-td_teamOne ${darkTheme && "dark"}`}>
          {currentH2HStats.length > 1 &&
            currentStatsReduce
              .find((x) => x.teamOneLose)
              .teamOneLose.reduce((a, b) => a + b)}
        </td>
        <td className={`h2h__table-td_title ${darkTheme && "dark"}`}>Lose</td>
        <td className={`h2h__table-td_teamTwo ${darkTheme && "dark"}`}>
          {currentH2HStats.length > 1 &&
            currentStatsReduce
              .find((x) => x.teamTwoLose)
              .teamTwoLose.reduce((a, b) => a + b)}
        </td>
      </tr>
    </>
  );

  return (
    <>
      <div className="section__title">
        <div className="section__title-name">H2H</div>
      </div>
      <div className="tableContainer">
        <div className="h2h__wrapper">
          <select
            className={`h2h__select ${darkTheme && "dark"}`}
            onChange={(e) => setTeamOne(e.target.value)}
          >
            <option value="Select team">Select team</option>
            {teams?.map((team) => (
              <option value={team.name}>{team.name}</option>
            ))}
          </select>
          <select
            className={`h2h__select ${darkTheme && "dark"}`}
            onChange={(e) => setTeamTwo(e.target.value)}
          >
            <option value="Select team">Select team</option>
            {teams?.map((team) => (
              <option value={team.name}>{team.name}</option>
            ))}
          </select>
        </div>
        <div className="h2h__wrapper">
          {teams
            .filter((team) => team.name === teamOne)
            .map((team) => (
              <img className="h2h__logo" src={team.logo} alt="" />
            ))}
          <table className="h2h__table">{showH2HStats}</table>
          {teams
            .filter((team) => team.name === teamTwo)
            .map((team) => (
              <img className="h2h__logo" src={team.logo} alt="" />
            ))}
        </div>
        <table className="fixtures__table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Host</th>
              <th></th>
              <th></th>
              <th>Guest</th>
            </tr>
          </thead>
          <tbody>{showH2H}</tbody>
        </table>
      </div>
    </>
  );
};

export default H2H;
