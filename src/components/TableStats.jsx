import { useState, useContext } from "react";
import useTeams from "../hooks/useTeams";
import useTables from "../hooks/useTables";
import useMatches from "../hooks/useMatches";
import { Link } from "react-router-dom";
import { Context } from "../context/Provider";
import Loader from "./Loader";

const TableStats = () => {
  const { teams } = useTeams();
  const { tables, loading } = useTables();
  const { matches } = useMatches();
  const [{ darkTheme }] = useContext(Context);
  const [tab, setTab] = useState("Results");
  const [sortKey, setSortKey] = useState("position");
  const [sortAsc, setSortAsc] = useState(true);

  //Sort by: position, team_name, win, lose, draw, goal_plus, goal_minus, bilans

  const formTeamMatches = (team) => {
    const match = matches
      ?.filter((match) => match.season === 2021)
      .filter((match) => match.host_name === team || match.guest_name === team)
      .filter((match) => match.round >= 11 && match.round <= 15)
      .sort((a, b) => b.round - a.round)
      .map((match, i) => (
        <td
          key={i}
          className={`
            ${
              match.host_name === team && match.host_score > match.guest_score
                ? "td__win"
                : match.host_name === team &&
                  match.host_score < match.guest_score
                ? "td__lose"
                : match.host_name === team &&
                  match.host_score === match.guest_score
                ? "td__draw"
                : ""
            }
            ${
              match.guest_name === team && match.guest_score > match.host_score
                ? "td__win"
                : match.guest_name === team &&
                  match.guest_score < match.host_score
                ? "td__lose"
                : match.guest_name === team &&
                  match.host_score === match.guest_score
                ? "td__draw"
                : ""
            }
            ${darkTheme && "dark"}
          `}
        >
          {match.host_name === team && match.host_score > match.guest_score
            ? "W"
            : match.host_name === team && match.host_score < match.guest_score
            ? "L"
            : match.host_name === team && match.host_score === match.guest_score
            ? "D"
            : ""}
          {match.guest_name === team && match.guest_score > match.host_score
            ? "W"
            : match.guest_name === team && match.guest_score < match.host_score
            ? "L"
            : match.guest_name === team &&
              match.host_score === match.guest_score
            ? "D"
            : ""}
        </td>
      ));

    return match;
  };

  const showTable = tables
    .filter((table) => table.season === 2021)
    .sort((a, b) =>
      sortAsc ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]
    )
    .map((table, index) => (
      <tr key={index}>
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
        {tab === "Form" && formTeamMatches(table.team_name)}
        <td className={`${darkTheme && "dark"}`}>
          <div className={`td__pts ${darkTheme && "dark"}`}>{table.points}</div>
        </td>
      </tr>
    ));

  return (
    <>
      <section className="tableStats">
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
          <button
            className={`${tab === "Form" && "active"} ${darkTheme && "dark"}`}
            onClick={() => setTab("Form")}
          >
            Form
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

export default TableStats;
