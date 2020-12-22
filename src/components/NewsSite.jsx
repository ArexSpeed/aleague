import React, { useState, useEffect } from "react";

import "../styles/News.scss";
import News from "./News";

function NewsSite() {
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });
  //change dimension instead mediaQuery
  useEffect(() => {
    function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }

    window.addEventListener("resize", handleResize);
    return (_) => {
      window.removeEventListener("resize", handleResize);
    };
  });

  const newsMainStyle = {
    width: "450px",
    height: "675px",
    fontSize: "150%",
  };
  const newsMainStyleMobile = {
    width: "300px",
    height: "450px",
  };

  return (
    <>
      <section>
        <div className="sectionLine">
          <span className="sectionLine__title">News</span>
        </div>
        <div className="container">
          <div className="news__box-main">
            <News
              id={4}
              title="Interview"
              text="Coach Victory want to win the league and he want to go throught the history to be the best coach in the world and in all history in ~Arkadian League. Until now he won 5 title as a player and 4 title as a coach. He plays in Victory Tigers, Victory City FC and Leyonell Lions"
              style={
                dimensions.width > 900 ? newsMainStyle : newsMainStyleMobile
              }
            />
            <News
              id={4}
              title="Interview"
              text="Coach Victory want to win the league and he "
              style={
                dimensions.width > 900 ? newsMainStyle : newsMainStyleMobile
              }
            />
          </div>

          <div className="news__box-rest">
            <News
              id={4}
              title="Interview"
              text="Coach Victory want to win the league and he want to go throught the history to be the best coach in the world and in all history in ~Arkadian League. Until now he won 5 title as a player and 4 title as a coach. He plays in Victory Tigers, Victory City FC and Leyonell Lions"
            />
            <div className="news__box"></div>
            <div className="news__box"></div>
          </div>
        </div>
      </section>
    </>
  );
}

export default NewsSite;
