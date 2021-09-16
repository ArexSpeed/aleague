import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {Context} from '../context'

import "../styles/Fixtures.scss";
import Loader from "./Loader";

function Fixtures() {
  const [loading, setLoading] = useState(false);
  const [roundSelect, setRoundSelect] = useState(1);
  const [matches, setMatches] = useState([]);
  const { url } = useContext(Context);
  useEffect(() => {
    setLoading(true);
    const fetchMatches = async () => {
      const { data } = await axios.get(`${url}/api/matches`);
      setMatches(data);
      setLoading(false);
    };

    fetchMatches();
  }, []);

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

  const fixtures = matches
    .filter(
      (match) => match.round === Number(roundSelect) && match.season === 2021
    )
    .map((match, index) => (
      <tr key={index}>
        <td className="td-skew td__round">{match.round}</td>
        <td className="td-skew td__host-name">{match.host_name}</td>
        <td className="td-skew td__host-score">{match.host_score}</td>
        <td className="td-skew td__guest-score">{match.guest_score}</td>
        <td className="td-skew td__guest-name">{match.guest_name}</td>
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
          {loading && <Loader text="fixtures" />}
          <tr>
            <th>R</th>
            <th>Host</th>
            <th>SH</th>
            <th>SG</th>
            <th>Guest</th>
          </tr>
          {fixtures}
        </table>
      </div>
    </div>
  );
}

export default Fixtures;
