import React from "react";
import { stats } from "../data/stats";
import useTeams from "../hooks/useTeams";

const AsideStats = () => {
  const { teams } = useTeams();
  const goals = [...stats].sort((a, b) => b.goals - a.goals).slice(0, 5);
  const assists = [...stats].sort((a, b) => b.assists - a.assists).slice(0, 5);
  const ratings = [...stats].sort((a, b) => b.rating - a.rating).slice(0, 5);

  return (
    <div className="stats">
      {/* Goals Stats */}
      <div className="stats__box">
        <div className="votes__title">
          <div className="subsection__square"></div>
          <span>Goals</span>
        </div>
        <table className="statsTable">
          <thead>
            <tr>
              <th>#</th>
              <th></th>
              <th style={{ textAlign: "left" }}>Name</th>
              <th>G</th>
            </tr>
          </thead>
          <tbody>
            {goals.map((item, i) => (
              <tr key={i}>
                <td>
                  <div className="statsTable__td-pos">{i + 1}</div>
                </td>
                <td>
                  {teams
                    ?.filter((team) => team.name === item.club)
                    ?.map((team) => (
                      <img
                        src={team.logo}
                        className="statsTable__td-image"
                        alt={team.name}
                      />
                    ))}
                </td>
                <td>
                  <div className="statsTable__td-name">{item.name}</div>
                </td>
                <td>
                  <div className="statsTable__td-pts">{item.goals}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Assists */}
      <div className="stats__box">
        <div className="votes__title">
          <div className="subsection__square"></div>
          <span>Assists</span>
        </div>
        <table className="statsTable">
          <thead>
            <tr>
              <th>#</th>
              <th></th>
              <th style={{ textAlign: "left" }}>Name</th>
              <th>A</th>
            </tr>
          </thead>
          <tbody>
            {assists.map((item, i) => (
              <tr key={i}>
                <td>
                  <div className="statsTable__td-pos">{i + 1}</div>
                </td>
                <td>
                  {teams
                    ?.filter((team) => team.name === item.club)
                    ?.map((team) => (
                      <img
                        src={team.logo}
                        className="statsTable__td-image"
                        alt={team.name}
                      />
                    ))}
                </td>
                <td>
                  <div className="statsTable__td-name">{item.name}</div>
                </td>
                <td>
                  <div className="statsTable__td-pts">{item.assists}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Rating */}
      <div className="stats__box">
        <div className="votes__title">
          <div className="subsection__square"></div>
          <span>Ratings</span>
        </div>
        <table className="statsTable">
          <thead>
            <tr>
              <th>#</th>
              <th></th>
              <th style={{ textAlign: "left" }}>Name</th>
              <th>R</th>
            </tr>
          </thead>
          <tbody>
            {ratings.map((item, i) => (
              <tr key={i}>
                <td>
                  <div className="statsTable__td-pos">{i + 1}</div>
                </td>
                <td>
                  {teams
                    ?.filter((team) => team.name === item.club)
                    ?.map((team) => (
                      <img
                        src={team.logo}
                        className="statsTable__td-image"
                        alt={team.name}
                      />
                    ))}
                </td>
                <td>
                  <div className="statsTable__td-name">{item.name}</div>
                </td>
                <td>
                  <div className="statsTable__td-pts">{item.rating}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AsideStats;
