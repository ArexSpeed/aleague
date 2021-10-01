import { useState, useContext } from "react";
import { Context } from "../context/Provider";
import useMatches from "../hooks/useMatches";

const TeamFixtures = ({ team }) => {
  const [{ darkTheme }] = useContext(Context);
  const [tab, setTab] = useState("Played");
  const { matches, loading } = useMatches();

  const fixtures = matches
    .filter((match) => match.season === 2021)
    .filter(
      (match) =>
        match.host_name === team?.name || match.guest_name === team?.name
    )
    .sort((a, b) => a.round - b.round)
    .filter((match) =>
      tab === "Played" ? match.round <= 15 : match.round > 15
    )
    .map((match) => (
      <tr key={match._id}>
        <td className={`${darkTheme && "dark"}`}>{match.round}</td>
        <td
          className={`${match.host_name === team?.name && "td__teamSiteName"} ${
            darkTheme && "dark"
          }`}
        >
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
        <td
          className={`${
            match.guest_name === team?.name && "td__teamSiteName"
          } ${darkTheme && "dark"}`}
        >
          {match.guest_name}
        </td>
      </tr>
    ));

  return (
    <section className={`section ${darkTheme && "dark"}`}>
      <div className="section__title">
        <div className="section__title-name">Team Fixtures</div>
      </div>
      <div className="tableContainer">
        <div className="tableStats__header">
          <button
            className={`${tab === "Played" && "active"} ${darkTheme && "dark"}`}
            onClick={() => setTab("Played")}
          >
            Played
          </button>
          <button
            className={`${tab === "Upcoming" && "active"} ${
              darkTheme && "dark"
            }`}
            onClick={() => setTab("Upcoming")}
          >
            Upcoming
          </button>
        </div>
        <table className="fixtures__table">
          <thead>
            <tr>
              <th>R</th>
              <th>Host</th>
              <th></th>
              <th></th>
              <th>Guest</th>
            </tr>
          </thead>
          <tbody>{fixtures}</tbody>
        </table>
      </div>
    </section>
  );
};

export default TeamFixtures;
