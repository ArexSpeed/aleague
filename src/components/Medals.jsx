import { useState, useEffect, useContext } from "react";
import { Context } from "../context/Provider";
import useTables from "../hooks/useTables";
import useTeams from "../hooks/useTeams";

const Medals = () => {
  const [{ darkTheme }] = useContext(Context);
  const { tables, loading } = useTables();
  const { teams } = useTeams();
  const [medalsSeason, setMedalsSeason] = useState([]);
  const [teamsMedalTable, setTeamsMedalTable] = useState([]);

  useEffect(() => {
    const medals = tables.filter(
      (team) =>
        (team.position === 1 || team.position === 2 || team.position === 3) &&
        team.season !== 2021
    );
    setMedalsSeason(medals);
  }, [tables]);

  useEffect(() => {
    let medalTables = [];
    teams.map((team) =>
      medalTables.push({
        name: team.name,
        logo: team.logo,
        first: 0,
        second: 0,
        third: 0,
      })
    );

    setTeamsMedalTable(medalTables);
  }, [teams]);

  medalsSeason?.forEach((table) => {
    const found = teamsMedalTable.find((team) => team.name === table.team_name);
    switch (table.position) {
      case 1:
        found.first++;
        break;
      case 2:
        found.second++;
        break;
      case 3:
        found.third++;
        break;
      default:
        break;
    }
  });

  const tableShow = teamsMedalTable
    ?.sort(
      (a, b) => b.first - a.first || b.second - a.second || b.third - a.third
    )
    .map((team, index) => (
      <tr key={index}>
        <td className={`${darkTheme && "dark"}`}>{index + 1}</td>
        <td className={`${darkTheme && "dark"}`}>
          <div className={`td__club ${darkTheme && "dark"}`}>
            <img src={team.logo} className="td__club-image" alt={team.name} />
            {team.name}
          </div>
        </td>
        <td className="td__gold">{team?.first}</td>
        <td className="td__silver">{team?.second}</td>
        <td className="td__brown">{team?.third}</td>
        <td className={`${darkTheme && "dark"}`}>
          <div className={`td__pts ${darkTheme && "dark"}`}>
            {team.first + team.second + team.third}
          </div>
        </td>
      </tr>
    ));

  return (
    <>
      <div className="section__title">
        <div className="section__title-name">Medals</div>
      </div>
      <article className="subsection">
        <div className="subsection__square"></div>
        <div className="subsection__title">Season by season</div>
      </article>
      <section className="tableContainer">
        <table className={`table ${darkTheme && "dark"}`}>
          <thead className={`${darkTheme && "dark"}`}>
            <tr>
              <th>Year</th>
              <th>Champion</th>
              <th>V-ce</th>
              <th>Third</th>
              <th></th>
            </tr>
          </thead>
          {console.log(teamsMedalTable, "medals")}
          <tbody>
            {medalsSeason
              .sort((a, b) => a.season - b.season || a.position - b.position)
              .map((team, index) => (
                <>
                  {team.position === 1 ? (
                    <tr>
                      <td className={darkTheme && "dark"}>{team.season}</td>
                      {medalsSeason
                        .filter((item) => team.season === item.season)
                        .map((team) => (
                          <td
                            className={
                              team.position === 1
                                ? "td__gold"
                                : team.position === 2
                                ? "td__silver"
                                : "td__brown"
                            }
                          >
                            {team.team_name}
                          </td>
                        ))}
                      <td style={{ visibility: "hidden" }}></td>
                    </tr>
                  ) : (
                    ""
                  )}
                </>
              ))}
          </tbody>
        </table>
      </section>
      <article className="subsection">
        <div className="subsection__square"></div>
        <div className="subsection__title">Medals table</div>
      </article>
      <section className="tableContainer">
        <table className={`table ${darkTheme && "dark"}`}>
          <thead className={`${darkTheme && "dark"}`}>
            <tr>
              <th>#</th>
              <th>Club</th>
              <th>1</th>
              <th>2</th>
              <th>3</th>
              <th>Sum</th>
            </tr>
          </thead>
          <tbody>{tableShow}</tbody>
        </table>
      </section>
    </>
  );
};

export default Medals;
