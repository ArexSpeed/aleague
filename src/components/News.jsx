import React from "react";
import { Link } from "react-router-dom";

function News({ id, image, title, text, style }) {
  return (
    <Link
      to={`/news/${id}`}
      className="news__box btn-border-move"
      style={style}
    >
      <div
        // className="news__container"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div className="news__img"></div>

        <h1 className="news__title">{title}</h1>
        <div className="news__text">
          <p>{text.length > 150 ? text.slice(150) + "..." : text}</p>
        </div>
        <button className="news__btn">Read More</button>
      </div>
    </Link>
  );
}

export default News;
