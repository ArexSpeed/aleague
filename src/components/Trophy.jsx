import { useContext } from "react";
import { Context } from "../context/Provider";
import useTables from "../hooks/useTables";
import Tilt from "react-tilt";

const Trophy = ({ team }) => {
  const { tables } = useTables();
  const [{ darkTheme }] = useContext(Context);

  const showTrophies = tables
    .filter((table) => table.team_name === team?.name && table.season !== 2021)
    .sort((a, b) => a.season - b.season)
    .map(
      (team, index) =>
        (team.position === 1 || team.position === 2 || team.position === 3) && (
          <Tilt
            className="Tilt"
            options={{ max: 10 }}
            style={{ height: 250, width: 150, margin: 10, perspective: 1000 }}
          >
            <div className="trophy__card" key={index}>
              <svg
                className={`trophy__star ${
                  team.position === 1
                    ? "gold"
                    : team.position === 2
                    ? "silver"
                    : "brown"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <div
                className="trophy__line"
                style={{
                  backgroundColor: `${
                    team.position === 1
                      ? "gold"
                      : team.position === 2
                      ? "silver"
                      : "brown"
                  }`,
                }}
              ></div>
              <div
                className="trophy__year"
                style={{
                  color: `${
                    team.position === 1
                      ? "gold"
                      : team.position === 2
                      ? "silver"
                      : "brown"
                  }`,
                }}
              >
                {team.season}
              </div>
            </div>
          </Tilt>
        )
    );

  const latestSeasons = tables
    .filter((table) => team?.name === table.team_name)
    .sort((a, b) => a.season - b.season)
    .map((team, index) => (
      <tr key={index}>
        <td className={`${darkTheme && "dark"}`}>
          <div
            className={`td__pos ${darkTheme && "dark"} ${
              team.position === 1
                ? "gold"
                : team.position === 2
                ? "silver"
                : team.position === 3
                ? "brown"
                : team.position > 14
                ? "red"
                : team.position > 12
                ? "purple"
                : ""
            }`}
          >
            {team.position}
          </div>
        </td>
        <td className={`${darkTheme && "dark"}`}>{team.season}</td>
        <td className={`${darkTheme && "dark"}`}>{team.team_name}</td>
        <td className={`${darkTheme && "dark"}`}>{team.match}</td>
        <td className={`td__win ${darkTheme && "dark"}`}>{team.win}</td>
        <td className={`${darkTheme && "dark"}`}>{team.draw}</td>
        <td className={`td__lose ${darkTheme && "dark"}`}>{team.lose}</td>
        <td className={`td__mobileHide ${darkTheme && "dark"}`}>
          {team.goal_plus}
        </td>
        <td className={`td__mobileHide ${darkTheme && "dark"}`}>
          {team.goal_minus}
        </td>
        <td className={`td__mobileHide ${darkTheme && "dark"}`}>
          {team.bilans}
        </td>
        <td className={`${darkTheme && "dark"}`}>
          <div className={`td__pts ${darkTheme && "dark"}`}>{team.points}</div>
        </td>
      </tr>
    ));

  return (
    <section className={`section ${darkTheme && "dark"}`}>
      <div className="section__title">
        <div className="section__title-name">History</div>
      </div>
      <article className="subsection">
        <div className="subsection__square"></div>
        <div className="subsection__title">Trophies</div>
      </article>
      <div className="trophy__container">{showTrophies}</div>
      <article className="subsection">
        <div className="subsection__square"></div>
        <div className="subsection__title">Results</div>
      </article>
      <div className="subsection__table">
        <table className={`table ${darkTheme && "dark"}`}>
          <thead className={`${darkTheme && "dark"}`}>
            <tr>
              <th>Pos</th>
              <th>Year</th>
              <th>Club</th>
              <th>M</th>
              <th>W</th>
              <th>D</th>
              <th>L</th>
              <th className="th__mobileHide">G+</th>
              <th className="th__mobileHide">G-</th>
              <th className="th__mobileHide">Bil</th>
              <th>PTS</th>
            </tr>
          </thead>
          <tbody>{latestSeasons}</tbody>
        </table>
      </div>
    </section>
  );
};

export default Trophy;
