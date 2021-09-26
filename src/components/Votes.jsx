import React, { useState, useEffect, useContext } from "react";
import { Percent } from "./Votes.styled";
import axios from "axios";
import { Context } from "../context";

const Votes = () => {
  const { url } = useContext(Context);
  const [votes, setVotes] = useState([]);
  const [votesPoints, setVotePoints] = useState(false);
  const [sumPoints, setSumPoints] = useState({});
  const [voteResult, setVoteResult] = useState({
    goalkeeper: "",
    defender: "",
    midfielder: "",
    forward: "",
    coach: "",
  });

  useEffect(() => {
    const fetchVotes = async () => {
      const { data } = await axios.get(`${url}/api/votes`);
      setVotes(data);
    };

    fetchVotes();
  }, []);

  const countPoints = () => {
    axios.post(`${url}/api/votes`, voteResult);
    let pointsSum = votes.find((vote) => vote.allPoints);
    setVotePoints(true);
    setSumPoints(pointsSum);
  };

  const voteSend = (e) => {
    e.preventDefault();
    countPoints();
  };

  const voteGoalkeeper = (e) => {
    setVoteResult({ ...voteResult, goalkeeper: e.target.value });
  };

  const voteDefender = (e) => {
    setVoteResult({ ...voteResult, defender: e.target.value });
  };

  const voteMidfielder = (e) => {
    setVoteResult({ ...voteResult, midfielder: e.target.value });
  };

  const voteForward = (e) => {
    setVoteResult({ ...voteResult, forward: e.target.value });
  };
  const voteCoach = (e) => {
    setVoteResult({ ...voteResult, coach: e.target.value });
  };

  return (
    <div className="votes">
      {!votesPoints ? (
        <form className="votes__form" onSubmit={voteSend}>
          {/* Goalkeepers */}
          <div className="votes__box">
            <div className="votes__title">
              <div className="subsection__square"></div>{" "}
              <span>Goalkeepers</span>
            </div>
            {votes
              .filter((vote) => vote.category === "Goalkeeper")
              .map((vote) => (
                <div key={vote.name} className="votes__checkbox">
                  <input
                    type="radio"
                    name="goalkeeper"
                    id={vote.name}
                    value={vote.name}
                    onClick={voteGoalkeeper}
                  />
                  <label htmlFor={vote.name} className="votes__label">
                    <span className="votes__span">{vote.name}</span>
                    <span className="votes__teamName">{vote.club_short}</span>
                  </label>
                </div>
              ))}
          </div>
          {/* Defenders */}
          <div className="votes__box">
            <div className="votes__title">
              <div className="subsection__square"></div> <span>Defenders</span>
            </div>
            {votes
              .filter((vote) => vote.category === "Defender")
              .map((vote) => (
                <div key={vote.name} className="votes__checkbox">
                  <input
                    type="radio"
                    name="defender"
                    id={vote.name}
                    value={vote.name}
                    onClick={voteDefender}
                  />
                  <label htmlFor={vote.name} className="votes__label">
                    <span className="votes__span">{vote.name}</span>
                    <span className="votes__teamName">{vote.club_short}</span>
                  </label>
                </div>
              ))}
          </div>
          {/* Midfielders */}
          <div className="votes__box">
            <div className="votes__title">
              <div className="subsection__square"></div>{" "}
              <span>Midfielders</span>
            </div>
            {votes
              .filter((vote) => vote.category === "Midfielder")
              .map((vote) => (
                <div key={vote.name} className="votes__checkbox">
                  <input
                    type="radio"
                    name="midfielder"
                    id={vote.name}
                    value={vote.name}
                    onClick={voteMidfielder}
                  />
                  <label htmlFor={vote.name} className="votes__label">
                    <span className="votes__span">{vote.name}</span>
                    <span className="votes__teamName">{vote.club_short}</span>
                  </label>
                </div>
              ))}
          </div>
          {/* Forwards */}
          <div className="votes__box">
            <div className="votes__title">
              <div className="subsection__square"></div> <span>Forwards</span>
            </div>
            {votes
              .filter((vote) => vote.category === "Forward")
              .map((vote) => (
                <div key={vote.name} className="votes__checkbox">
                  <input
                    type="radio"
                    name="forward"
                    id={vote.name}
                    value={vote.name}
                    onClick={voteForward}
                  />
                  <label htmlFor={vote.name} className="votes__label">
                    <span className="votes__span">{vote.name}</span>
                    <span className="votes__teamName">{vote.club_short}</span>
                  </label>
                </div>
              ))}
          </div>
          {/* Coaches */}
          <div className="votes__box">
            <div className="votes__title">
              <div className="subsection__square"></div> <span>Coaches</span>
            </div>
            {votes
              .filter((vote) => vote.category === "Coach")
              .map((vote) => (
                <div key={vote.name} className="votes__checkbox">
                  <input
                    type="radio"
                    name="coach"
                    id={vote.name}
                    value={vote.name}
                    onClick={voteCoach}
                  />
                  <label htmlFor={vote.name} className="votes__label">
                    <span className="votes__span">{vote.name}</span>
                    <span className="votes__teamName">{vote.club_short}</span>
                  </label>
                </div>
              ))}
          </div>
          <div className="votes__box-button">
            <button type="submit" className="votes__button">
              Vote
            </button>
          </div>
        </form>
      ) : (
        <div className="votes__form">
          <div className="votes__box">
            <div className="votes__title">
              <div className="subsection__square"></div>{" "}
              <span>Goalkeepers</span>
            </div>
            {votes
              .filter((vote) => vote.category === "Goalkeeper")
              .sort((a, b) => b.points - a.points)
              .map((vote) => (
                <div key={vote.name}>
                  <div className="votes__checkbox">
                    <label className="votes__label">
                      <span className="votes__span">{vote.name}</span>
                      <span className="votes__teamName">{vote.club_short}</span>
                    </label>
                  </div>
                  <div className="votes__points">
                    <Percent width={(vote.points / sumPoints.allPoints) * 100}>
                      {((vote.points / sumPoints.allPoints) * 100).toFixed(2)}%
                    </Percent>
                  </div>
                </div>
              ))}
          </div>
          {/* Defender score */}
          <div className="votes__box">
            <div className="votes__title">
              <div className="subsection__square"></div> <span>Defenders</span>
            </div>
            {votes
              .filter((vote) => vote.category === "Defender")
              .sort((a, b) => b.points - a.points)
              .map((vote) => (
                <div key={vote.name}>
                  <div className="votes__checkbox">
                    <label className="votes__label">
                      <span className="votes__span">{vote.name}</span>
                      <span className="votes__teamName">{vote.club_short}</span>
                    </label>
                  </div>
                  <div className="votes__points">
                    <Percent width={(vote.points / sumPoints.allPoints) * 100}>
                      {((vote.points / sumPoints.allPoints) * 100).toFixed(2)}%
                    </Percent>
                  </div>
                </div>
              ))}
          </div>
          {/* Midfielder score */}
          <div className="votes__box">
            <div className="votes__title">
              <div className="subsection__square"></div>{" "}
              <span>Midfielders</span>
            </div>
            {votes
              .filter((vote) => vote.category === "Midfielder")
              .sort((a, b) => b.points - a.points)
              .map((vote) => (
                <div key={vote.name}>
                  <div className="votes__checkbox">
                    <label className="votes__label">
                      <span className="votes__span">{vote.name}</span>
                      <span className="votes__teamName">{vote.club_short}</span>
                    </label>
                  </div>
                  <div className="votes__points">
                    <Percent width={(vote.points / sumPoints.allPoints) * 100}>
                      {((vote.points / sumPoints.allPoints) * 100).toFixed(2)}%
                    </Percent>
                  </div>
                </div>
              ))}
          </div>
          {/* Forward score */}
          <div className="votes__box">
            <div className="votes__title">
              <div className="subsection__square"></div> <span>Forwards</span>
            </div>
            {votes
              .filter((vote) => vote.category === "Forward")
              .sort((a, b) => b.points - a.points)
              .map((vote) => (
                <div key={vote.name}>
                  <div className="votes__checkbox">
                    <label className="votes__label">
                      <span className="votes__span">{vote.name}</span>
                      <span className="votes__teamName">{vote.club_short}</span>
                    </label>
                  </div>
                  <div className="votes__points">
                    <Percent width={(vote.points / sumPoints.allPoints) * 100}>
                      {((vote.points / sumPoints.allPoints) * 100).toFixed(2)}%
                    </Percent>
                  </div>
                </div>
              ))}
          </div>
          {/* Coach score */}
          <div className="votes__box">
            <div className="votes__title">
              <div className="subsection__square"></div> <span>Coaches</span>
            </div>
            {votes
              .filter((vote) => vote.category === "Coach")
              .sort((a, b) => b.points - a.points)
              .map((vote) => (
                <div key={vote.name}>
                  <div className="votes__checkbox">
                    <label className="votes__label">
                      <span className="votes__span">{vote.name}</span>
                      <span className="votes__teamName">{vote.club_short}</span>
                    </label>
                  </div>
                  <div className="votes__points">
                    <Percent width={(vote.points / sumPoints.allPoints) * 100}>
                      {((vote.points / sumPoints.allPoints) * 100).toFixed(2)}%
                    </Percent>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Votes;
