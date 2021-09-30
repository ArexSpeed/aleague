import { useState, useEffect, useContext } from "react";
import { Context } from "../context/Provider";
import useTeams from "../hooks/useTeams";
import { useParams } from "react-router-dom";
import useTables from "../hooks/useTables";

const TeamInfo = () => {
  const [{ darkTheme }] = useContext(Context);
  const { teamsite } = useParams();
  const { teams } = useTeams();
  const { tables, loading } = useTables();
  const [team, setTeam] = useState([]);
  const [currentStats, setCurrentStats] = useState();

  useEffect(() => {
    const name = teams.find((team) => team.site === teamsite);
    setTeam(name);
  }, [teamsite, teams]);

  useEffect(() => {
    const stats = tables
      ?.filter((table) => table.season === 2021)
      .find((table) => table.team_name === team?.name);
    setCurrentStats(stats);
  }, [tables, team]);

  return (
    <>
      <section className={`section ${darkTheme && "dark"}`}>
        {console.log(team, "team")}
        <div className="section__title">
          <div className="section__title-name">{team?.name}</div>
        </div>
        <div className="team__info">
          <div className="team__info-logo">
            <img src={team?.logo} className="team__info-logo-img" alt="logo" />
          </div>
          <div className="team__info-currentStats">
            <div className="team__info-currentStats-row">Current Stats</div>
            <div className="team__info-currentStats-row">
              <div className="team__info-currentStats-box points">
                <span className="team__info-currentStats-box-number">
                  {currentStats?.points}
                </span>
                <span
                  className={`team__info-currentStats-box-name ${
                    darkTheme && "dark"
                  }`}
                >
                  Points
                </span>
              </div>
              <div
                className={`team__info-currentStats-box ${
                  darkTheme && "dark"
                } ${
                  currentStats?.position === 1
                    ? "gold"
                    : currentStats?.position === 2
                    ? "silver"
                    : currentStats?.position === 3
                    ? "brown"
                    : currentStats?.position > 14
                    ? "red"
                    : currentStats?.position > 12
                    ? "purple"
                    : ""
                }`}
              >
                <span className="team__info-currentStats-box-number">
                  {currentStats?.position}
                </span>
                <span
                  className={`team__info-currentStats-box-name ${
                    darkTheme && "dark"
                  }`}
                >
                  Place
                </span>
              </div>
              <div
                className={`team__info-currentStats-box matches ${
                  darkTheme && "dark"
                }`}
              >
                <span className="team__info-currentStats-box-number">
                  {currentStats?.match}
                </span>
                <span
                  className={`team__info-currentStats-box-name ${
                    darkTheme && "dark"
                  }`}
                >
                  Matches
                </span>
              </div>
            </div>
            <div className="team__info-currentStats-row">
              <div className="team__info-currentStats-box win">
                <span className="team__info-currentStats-box-number">
                  {currentStats?.win}
                </span>
                <span
                  className={`team__info-currentStats-box-name ${
                    darkTheme && "dark"
                  }`}
                >
                  Wins
                </span>
              </div>
              <div className="team__info-currentStats-box draw">
                <span className="team__info-currentStats-box-number">
                  {currentStats?.draw}
                </span>
                <span
                  className={`team__info-currentStats-box-name ${
                    darkTheme && "dark"
                  }`}
                >
                  Draws
                </span>
              </div>
              <div className="team__info-currentStats-box lose">
                <span className="team__info-currentStats-box-number">
                  {currentStats?.lose}
                </span>
                <span
                  className={`team__info-currentStats-box-name ${
                    darkTheme && "dark"
                  }`}
                >
                  Loses
                </span>
              </div>
            </div>
            <div className="team__info-currentStats-row">
              <div
                className={`team__info-currentStats-box plus ${
                  darkTheme && "dark"
                }`}
              >
                <span className="team__info-currentStats-box-number">
                  {currentStats?.goal_plus}
                </span>
                <span
                  className={`team__info-currentStats-box-name ${
                    darkTheme && "dark"
                  }`}
                >
                  Goals+
                </span>
              </div>
              <div
                className={`team__info-currentStats-box minus ${
                  darkTheme && "dark"
                }`}
              >
                <span className="team__info-currentStats-box-number">
                  {currentStats?.goal_minus}
                </span>
                <span
                  className={`team__info-currentStats-box-name ${
                    darkTheme && "dark"
                  }`}
                >
                  Goals-
                </span>
              </div>
              <div
                className={`team__info-currentStats-box bilans ${
                  darkTheme && "dark"
                }`}
              >
                <span className="team__info-currentStats-box-number">
                  {currentStats?.bilans}
                </span>
                <span
                  className={`team__info-currentStats-box-name ${
                    darkTheme && "dark"
                  }`}
                >
                  Bilans
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TeamInfo;
