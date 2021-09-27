import { useEffect, useState, useContext } from "react";
import { Context } from "../context/Provider";
import { Link } from "react-router-dom";
import { matches } from "../data/bannerMatches";

const Hero = () => {
  const [{ darkTheme }] = useContext(Context);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const changeIndex = () => {
      if (index === 7) {
        setIndex(0);
      } else {
        setIndex((prev) => prev + 1);
      }
    };
    const intervalId = setInterval(() => {
      changeIndex();
    }, 3000);
    return () => clearInterval(intervalId);
  }, [index]);

  return (
    <div className="hero">
      <div className="hero__title">
        <div className={`hero__title-top ${darkTheme && "dark"}`}>
          ATLAND LEAGUE
          <div className={`hero__title-bottom ${darkTheme && "dark"}`}>
            Your best football league
          </div>
        </div>
      </div>
      <div className="hero__banner">
        <div className="hero__banner-box">
          <img
            src={matches[index].imageHost}
            alt=""
            className="hero__banner-image-host"
          />
          <div className="hero__banner-square host"></div>
          <div className="hero__banner-info">
            <div>
              <div className="hero__banner-info-title">Next Round</div>
              <div className="hero__banner-info-match">
                {matches[index].host} - {matches[index].guest}
              </div>
            </div>
            <div className="hero__banner-info-subtitle">
              Watch every seconds on AL TV
            </div>
            <div className="hero__banner-info-mobile">
              <div className="hero__banner-info-subtitle-mobile">
                Watch every seconds on AL TV
              </div>
              <Link to="/tv">
                <button className="hero__banner-info-button">Join now</button>
              </Link>
            </div>
          </div>
          <div className="hero__banner-square guest"></div>
          <img
            src={matches[index].imageGuest}
            alt=""
            className="hero__banner-image-guest"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
