import { useContext } from "react";
import { Context } from "../context/Provider";

const HeroNews = () => {
  const [{ darkTheme }] = useContext(Context);

  return (
    <div className="hero">
      <div className="hero__title">
        <div className={`hero__title-top ${darkTheme && "dark"}`}>
          ATLAND LEAGUE
          <div className={`hero__title-bottom ${darkTheme && "dark"}`}>
            News
          </div>
        </div>
      </div>
      <div className="hero__news">
        <div className={`hero__news-scroll ${darkTheme && "dark"}`}>
          <div className="hero__news-scroll-content">
            <span>15 round scores: </span>{" "}
            <div className="hero__news-square blue"></div>{" "}
            <span>Neptuns - Tigers 2 : 0</span>{" "}
            <div className="hero__news-square green"></div>
            <span>Knights - Torros 0 : 2</span>{" "}
            <div className="hero__news-square blue"></div>
            <span>Diamond - Goats 3 : 1</span>{" "}
            <div className="hero__news-square green"></div>
            <span>Bats - Monarch 0 : 0</span>{" "}
            <div className="hero__news-square blue"></div>
            <span>Angels - Fox 1 : 0</span>{" "}
            <div className="hero__news-square green"></div>
            <span>Roses - Ronnpolis 1 : 0</span>{" "}
            <div className="hero__news-square blue"></div>
            <span>Bolts - Bears 0 : 0</span>{" "}
            <div className="hero__news-square green"></div>
            <span>Wolves - Shamrock 0 : 1</span>{" "}
            <div className="hero__news-square blue"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroNews;
