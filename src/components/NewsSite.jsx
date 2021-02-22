import React, { useState, useEffect } from "react";

import "../styles/News.scss";
import News from "./News";
import {news} from '../data/news';

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
            {news.filter(item => item.id <= 2)
            .map((item, index) => (
              <News
              key={index}
              id={item.id}
              title=  {item.title}
              image = {item.img}
              text= {item.desc}
              style={
                dimensions.width > 900 ? newsMainStyle : newsMainStyleMobile
              }
            />
            ))}
            
          </div>

          <div className="news__box-rest">
          {news.filter(item => item.id >= 3)
            .map((item, index) => (
              <News
              key={index}
              id={item.id}
              title=  {item.title}
              image = {item.img}
              text= {item.desc}
            />
            ))}

          </div>
        </div>
      </section>
    </>
  );
}

export default NewsSite;
