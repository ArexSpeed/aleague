import { useContext, useState, useEffect } from "react";
import { Context } from "../context/Provider";
import { useParams } from "react-router-dom";
import useTeams from "../hooks/useTeams";
import Aside from "../components/Aside";
import TeamInfo from "../components/TeamInfo";
import Trophy from "../components/Trophy";
import TeamFixtures from "../components/TeamFixtures";
import { news } from "../data/news";
import NewsCard from "../components/NewsCard";

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
        <section className={`section ${darkTheme && "dark"}`}>
          <div className="section__title">
            <div className="section__title-name">Team News</div>
          </div>
          <div className="subsection__news">
            {news
              .filter((item) => item.teamSite.includes(teamsite))
              .map((item, index) => (
                <NewsCard
                  key={index}
                  id={item.id}
                  category={item.category}
                  title={item.title}
                  image={item.img}
                  text={item.desc}
                  teams={item.teams}
                />
              ))}
          </div>
        </section>
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
