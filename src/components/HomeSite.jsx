import { useState, useEffect, useContext } from "react";
import { Context } from "../context";
import "../styles/Home.scss";
import Table from "./Table";
import News from "./News";
import axios from "axios";
import { news } from "../data/news";
import Video from "./Video";

const HomeSite = () => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const {  url  } = useContext(Context);;

  useEffect(() => {
    const fetchMatches = async () => {
      const { data } = await axios.get(`${url}/api/matches`);
      setMatches(data);
    };
    const fetchTeams = async () => {
      const { data } = await axios.get(`${url}/api/teams`);
      setTeams(data);
    };

    fetchMatches();
    fetchTeams();
  }, []);

  const results = matches
    .filter((match) => match.season === 2021 && match.round === 15)
    .map((match, index) => (
      <div key={index} className="score__box btn-slide-center-out">
        {teams
          .filter((team) => team.name === match.host_name)
          .map((team) => (
            <img
              src={team.logo}
              className="score__box-team_host"
              alt={team.name}
            />
          ))}
        <div className="score__box-score_result">
          <span className="score__box-score_host">{match.host_score}</span>
          <span className="score__box-score_guest">{match.guest_score}</span>
        </div>
        {teams
          .filter((team) => team.name === match.guest_name)
          .map((team) => (
            <img
              src={team.logo}
              className="score__box-team_guest"
              alt={team.name}
            />
          ))}
      </div>
    ));

  return (
    <>
      <section id="table">
        <div className="sectionLine">
          <span className="sectionLine__title">Table</span>
        </div>
        <div className="containerTable">
          <Table />
        </div>
      </section>

      <section className="last__score">
        <div className="sectionLine">
          <span className="sectionLine__title">Last Scores</span>
        </div>
        <div className="container">{results}</div>
      </section>

      <section className="last__news" id="news">
        <div className="sectionLine">
          <span className="sectionLine__title">Latest News</span>
        </div>
        <div className="container">
          {news
            .filter((item) => item.id <= 3)
            .map((item, index) => (
              <News
                key={index}
                id={item.id}
                title={item.title}
                image={item.img}
                text={item.desc}
              />
            ))}
        </div>
      </section>

      <section className="last__video">
        <div className="sectionLine">
          <span className="sectionLine__title">Latest Video</span>
        </div>
        <div className="container">
          <Video />
        </div>
      </section>
    </>
  );
};

export default HomeSite;
