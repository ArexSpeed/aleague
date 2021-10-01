import { useState, useEffect, useContext, useRef } from "react";
import useTeams from "../hooks/useTeams";
import useTables from "../hooks/useTables";
import useMatches from "../hooks/useMatches";
import { Link } from "react-router-dom";
import { Context } from "../context/Provider";
import Loader from "./Loader";

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

const TableHistory = () => {
  const { teams } = useTeams();
  const { tables, loading } = useTables();
  const [{ darkTheme }] = useContext(Context);
  const [tab, setTab] = useState("Results");
  const [sortKey, setSortKey] = useState("position");
  const [sortAsc, setSortAsc] = useState(true);
  const [currentSeason, setCurrentSeason] = useState(2020);
  const [seasons, setSeasons] = useState([]);
  const [animateRow, setAnimateRow] = useState(true);
  const buttonsRef = useRef();

  useEffect(() => {
    let seasonsArr = [];
    for (let i = 2020; i >= 2011; i--) {
      seasonsArr.push(i);
    }
    setSeasons(seasonsArr);
  }, [tables]);

  const showTable = tables
    .filter((table) => table.season === currentSeason)
    .sort((a, b) =>
      sortAsc ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]
    )
    .map((table, index) => (
      <tr
        key={index}
        className={animateRow ? "tr__motion" : "tr__motionb"}
        style={{ animationDelay: `${index / 2}s` }}
      >
        <td className={`${darkTheme && "dark"}`}>
          <div
            className={`td__pos ${darkTheme && "dark"} ${
              table.position === 1
                ? "gold"
                : table.position === 2
                ? "silver"
                : table.position === 3
                ? "brown"
                : table.position > 14
                ? "red"
                : table.position > 12
                ? "purple"
                : ""
            }`}
          >
            {table.position}
          </div>
        </td>
        <td className={`${darkTheme && "dark"}`}>
          <Link
            to={`/team/${table.team_name.split(" ")[1].toLowerCase()}`}
            className={`td__club ${darkTheme && "dark"}`}
          >
            {teams
              .filter((team) => team.name === table.team_name)
              .map((team) => (
                <img
                  src={team.logo}
                  className="td__club-image"
                  alt={team.name}
                />
              ))}
            {table.team_name}
          </Link>
        </td>
        {tab === "Results" && (
          <>
            <td className={`${darkTheme && "dark"}`}>{table.match}</td>
            <td className={`td__win ${darkTheme && "dark"}`}>{table.win}</td>
            <td className={`${darkTheme && "dark"}`}>{table.draw}</td>
            <td className={`td__lose ${darkTheme && "dark"}`}>{table.lose}</td>
            <td className={`td__mobileHide ${darkTheme && "dark"}`}>
              {table.goal_plus}
            </td>
            <td className={`td__mobileHide ${darkTheme && "dark"}`}>
              {table.goal_minus}
            </td>
            <td className={`td__mobileHide ${darkTheme && "dark"}`}>
              {table.bilans}
            </td>
          </>
        )}
        {tab === "Goals" && (
          <>
            <td className={`td__win ${darkTheme && "dark"}`}>
              {table.goal_plus}
            </td>
            <td className={`td__lose ${darkTheme && "dark"}`}>
              {table.goal_minus}
            </td>
            <td className={`${darkTheme && "dark"}`}>{table.bilans}</td>
          </>
        )}
        <td className={`${darkTheme && "dark"}`}>
          <div className={`td__pts ${darkTheme && "dark"}`}>{table.points}</div>
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
    <>
      <div className="section__title">
        <div className="section__title-name">History Standings</div>
      </div>
      <section className="tableContainer">
        <div className="section__row">
          <section className="fixtures__rounds">
            <div className="fixtures__rounds-container">
              <span>Season:</span>
              <button className="fixtures__rounds-icon" onClick={scrollLeft}>
                <PrevIcon />
              </button>
              <div ref={buttonsRef} className="fixtures__rounds-buttons">
                {seasons?.map((season) => (
                  <button
                    key={season}
                    className={`fixtures__rounds-button ${
                      currentSeason === season && "current"
                    } ${darkTheme && "dark"}`}
                    style={{ minWidth: "50px" }}
                    onClick={() => {
                      setCurrentSeason(season);
                      setAnimateRow(!animateRow);
                    }}
                  >
                    {season}
                  </button>
                ))}
              </div>
              <button className="fixtures__rounds-icon" onClick={scrollRight}>
                <NextIcon />
              </button>
            </div>
          </section>
        </div>
        <div className="tableStats__header">
          <button
            className={`${tab === "Results" && "active"} ${
              darkTheme && "dark"
            }`}
            onClick={() => setTab("Results")}
          >
            Results
          </button>
          <button
            className={`mobile ${tab === "Goals" && "active"} ${
              darkTheme && "dark"
            }`}
            onClick={() => setTab("Goals")}
          >
            Goals
          </button>
        </div>
        <table className={`table ${darkTheme && "dark"}`}>
          <thead className={`${darkTheme && "dark"}`}>
            <tr>
              <th
                onClick={() => {
                  setSortKey("position");
                  setSortAsc(!sortAsc);
                }}
              >
                Pos
              </th>
              <th>Club</th>
              {tab === "Results" && (
                <>
                  <th>M</th>
                  <th
                    onClick={() => {
                      setSortKey("win");
                      setSortAsc(!sortAsc);
                    }}
                  >
                    W
                  </th>
                  <th
                    onClick={() => {
                      setSortKey("draw");
                      setSortAsc(!sortAsc);
                    }}
                  >
                    D
                  </th>
                  <th
                    onClick={() => {
                      setSortKey("lose");
                      setSortAsc(!sortAsc);
                    }}
                  >
                    L
                  </th>
                  <th
                    className="th__mobileHide"
                    onClick={() => {
                      setSortKey("goal_plus");
                      setSortAsc(!sortAsc);
                    }}
                  >
                    G+
                  </th>
                  <th
                    className="th__mobileHide"
                    onClick={() => {
                      setSortKey("goal_minus");
                      setSortAsc(!sortAsc);
                    }}
                  >
                    G-
                  </th>
                  <th
                    className="th__mobileHide"
                    onClick={() => {
                      setSortKey("bilans");
                      setSortAsc(!sortAsc);
                    }}
                  >
                    Bil
                  </th>
                </>
              )}
              {tab === "Goals" && (
                <>
                  <th
                    onClick={() => {
                      setSortKey("goal_plus");
                      setSortAsc(!sortAsc);
                    }}
                  >
                    G+
                  </th>
                  <th
                    onClick={() => {
                      setSortKey("goal_minus");
                      setSortAsc(!sortAsc);
                    }}
                  >
                    G-
                  </th>
                  <th
                    onClick={() => {
                      setSortKey("bilans");
                      setSortAsc(!sortAsc);
                    }}
                  >
                    Bil
                  </th>
                </>
              )}
              {tab === "Form" && (
                <>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                </>
              )}
              <th
                onClick={() => {
                  setSortKey("points");
                  setSortAsc(!sortAsc);
                }}
              >
                PTS
              </th>
            </tr>
          </thead>
          <tbody>{loading ? <Loader text="table" /> : showTable}</tbody>
        </table>
      </section>
    </>
  );
};

export default TableHistory;
