import React, { useState, useEffect } from "react";
import { scores } from "../data/matches";

import "../styles/Fixtures.scss";
function Fixtures() {
  const [roundSelect, setRoundSelect] = useState(1);

  let arrayRounds = [];

  for (let i = 1; i <= 30; i++) {
    arrayRounds.push(i);
  }

  const optionRound = arrayRounds.map((round, index) => (
    <option value={round} key={index}>
      {round}
    </option>
  ));

  const selectRound = (e) => {
    setRoundSelect(e.target.value);
    console.log(roundSelect);
  };

  const fixtures = scores
    .filter((score) => score.round === Number(roundSelect))
    .map((score) => (
      <tr>
        <td className="td__round">{score.round}</td>
        <td className="td__host-name">{score.host.name}</td>
        <td className="td__host-score">{score.host.score}</td>
        <td className="td__guest-score">{score.guest.score}</td>
        <td className="td__guest-name">{score.guest.name}</td>
        <td className="td__date">{score.date}</td>
      </tr>
    ));
  return (
    <div className="fixtures">
      <div className="fixtures__select">
        Show round:
        <select onChange={selectRound}>{optionRound}</select>
      </div>
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
  );
}

export default Fixtures;
