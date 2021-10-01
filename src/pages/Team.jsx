import { useContext, useState, useEffect } from "react";
import { Context } from "../context/Provider";
import { useParams } from "react-router-dom";
import useTeams from "../hooks/useTeams";
import Aside from "../components/Aside";
import TeamInfo from "../components/TeamInfo";
import Trophy from "../components/Trophy";
import TeamFixtures from "../components/TeamFixtures";

function Team() {
  const [{ darkTheme }] = useContext(Context);
  const { teamsite } = useParams();
  const { teams } = useTeams();
  const [team, setTeam] = useState([]);

  useEffect(() => {
    const name = teams.find((team) => team.site === teamsite);
    setTeam(name);
  }, [teamsite, teams]);

  return (
    <>
      <section className="main__wrapper">
        <TeamInfo />
        <Trophy team={team} />
        <TeamFixtures team={team} />
        <section className="main__aside-mobile">
          <div className={`main__aside-box ${darkTheme && "dark"}`}>
            <Aside />
          </div>
        </section>
      </section>
      <section className="main__aside">
        <div className={`main__aside-box ${darkTheme && "dark"}`}>
          <Aside />
        </div>
      </section>
    </>
  );
}

export default Team;
