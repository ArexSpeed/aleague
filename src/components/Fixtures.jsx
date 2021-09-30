import { useState, useEffect, useContext, useRef } from "react";
import { Context } from "../context/Provider";
import useMatches from "../hooks/useMatches";

const PrevIcon = () => (
  <svg
    className="prevIcon"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
);
const NextIcon = () => (
  <svg
    className="nextIcon"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

const Fixtures = () => {
  const [{ darkTheme }] = useContext(Context);
  const [currentRound, setCurrentRound] = useState(1);
  const { matches, loading } = useMatches();
  const [rounds, setRounds] = useState([]);
  const buttonsRef = useRef();

  useEffect(() => {
    let roundsArr = [];
    for (let i = 1; i <= 30; i++) {
      roundsArr.push(i);
    }

    setRounds(roundsArr);
  }, [matches]);

  const fixtures = matches
    .filter((match) => match.season === 2021)
    .filter((match) => match.round === currentRound)
    .map((match) => (
      <tr key={match._id}>
        <td className={`td__hostName ${darkTheme && "dark"}`}>
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
        <td className={`td__guestName ${darkTheme && "dark"}`}>
          {match.guest_name}
        </td>
      </tr>
    ));

  const scrollLeft = () => {
    buttonsRef.current.scrollLeft -= 40;
  };

  const scrollRight = () => {
    buttonsRef.current.scrollLeft += 40;
  };

  return (
    <div className="fixtures">
      <section className="fixtures__rounds">
        <div className="fixtures__rounds-container">
          <span>Rounds:</span>
          <button className="fixtures__rounds-icon" onClick={scrollLeft}>
            <PrevIcon />
          </button>
          <div ref={buttonsRef} className="fixtures__rounds-buttons">
            {rounds?.map((round) => (
              <button
                key={round}
                className={`fixtures__rounds-button ${
                  currentRound === round && "current"
                } ${darkTheme && "dark"}`}
                onClick={() => setCurrentRound(round)}
              >
                {round}
              </button>
            ))}
          </div>
          <button className="fixtures__rounds-icon" onClick={scrollRight}>
            <NextIcon />
          </button>
        </div>
      </section>
      <table className="fixtures__table">
        <thead>
          <tr>
            <th>Host</th>
            <th></th>
            <th></th>
            <th>Guest</th>
          </tr>
        </thead>
        <tbody>{fixtures}</tbody>
      </table>
    </div>
  );
};

export default Fixtures;
