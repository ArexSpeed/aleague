import { useContext } from "react";
import { Context } from "../context/Provider";
import { Link } from "react-router-dom";
import Table from "./Table";
import NewsCard from "./NewsCard";
import { news } from "../data/news";
import Video from "./Video";
import Loader from "./Loader";
import useTeams from "../hooks/useTeams";
import useMatches from "../hooks/useMatches";

const HomeSite = () => {
  const { teams, loading } = useTeams();
  const { matches } = useMatches();
  const [{ darkTheme }] = useContext(Context);

  const results = matches
    .filter((match) => match.season === 2021 && match.round === 15)
    .map((match, index) => (
      <div key={index} className="home__scoreBox btn-effect">
        {teams
          .filter((team) => team.name === match.host_name)
          .map((team) => (
            <img
              src={team.logo}
              className="home__scoreBox-image"
              alt={team.name}
            />
          ))}
        <div className="home__scoreBox-result">
          <span className="home__scoreBox-result-host">{match.host_score}</span>
          <span className="home__scoreBox-result-guest">
            {match.guest_score}
          </span>
        </div>
        {teams
          .filter((team) => team.name === match.guest_name)
          .map((team) => (
            <img
              src={team.logo}
              className="home__scoreBox-image"
              alt={team.name}
            />
          ))}
      </div>
    ));

  return (
    <>
      <section className={`section ${darkTheme && "dark"}`}>
        <div className="section__title">
          <div className="section__title-name">Current Stats</div>
          <Link
            to="/stats"
            className={`section__title-link ${darkTheme && "dark"}`}
          >
            View more
          </Link>
        </div>
        <article className="subsection">
          <div className="subsection__square"></div>
          <div className="subsection__title">Table</div>
        </article>
        <div className="subsection__table">
          <Table />
        </div>

        <article className="subsection">
          <div className="subsection__square"></div>
          <div className="subsection__title">Latest Games</div>
        </article>
        <div className="subsection__result">
          {loading ? <Loader text="results" /> : results}
        </div>
      </section>

      <section className={`section ${darkTheme && "dark"}`}>
        <div className="section__title">
          <div className="section__title-name">Latest news</div>
          <Link
            to="/news"
            className={`section__title-link ${darkTheme && "dark"}`}
          >
            View more
          </Link>
        </div>
        <article className="subsection">
          <div className="subsection__square"></div>
          <div className="subsection__title">Articles</div>
        </article>
        <div className="subsection__news">
          {news
            .filter((item) => item.id <= 3)
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
        <article className="subsection">
          <div className="subsection__square"></div>
          <div className="subsection__title">Videos</div>
        </article>
        <div className="subsection__news">
          <Video />
        </div>
      </section>
    </>
  );
};

export default HomeSite;
