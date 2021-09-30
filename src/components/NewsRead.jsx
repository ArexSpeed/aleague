import React from 'react'
import {Link} from 'react-router-dom'
import { news } from "../data/news";
import "../styles/NewsRead.scss";

const NewsRead = ({ match }) => {
  const showNews = news
    .filter((item) => item.id === Number(match.params.id))
    .map((item) => (
      <>
        <div className="news__read-box">
          <div className="news__img-shadow">
            <img src={item.img} alt="Pic" className="news__img-picture" />
          </div>

          <h1 className="news__read-title">{item.title}</h1>
          <div className="news__read-container">
            {item.category === "Coverage"
              ? item.description.map((desc) => (
                  <>
                    <h4>{desc.t}</h4>
                    <p>{desc.p}</p>
                  </>
                ))
              : item.category === "Interview"
              ? item.description.map((desc) => (
                  <>
                    <div className="news__text-interview">
                      <div className="news__text-interview-question"></div>
                      <p className="news__text-interview-question-text">
                        {desc.q}
                      </p>
                    </div>
                    <div className="news__text-interview">
                      <div className="news__text-interview-answer"></div>
                      <p className="news__text-interview-answer-text">
                        {desc.a}
                      </p>
                    </div>
                  </>
                ))
              : ""}
          </div>
          <div className="news__change">
            <Link
              to={item.id > 1 ? `/news/${item.id - 1}` : `/news/`}
              className="news__change-prev"
            >
              Prev
              {news
                .filter((item) => item.id === Number(match.params.id) - 1)
                .map((next) => (
                  <h5 className="news__change-title">{next.title}</h5>
                ))}
            </Link>
            <Link
              to={item.id < news.length ? `/news/${item.id + 1}` : `/news/`}
              className="news__change-next"
            >
              Next
              {news
                .filter((item) => item.id === Number(match.params.id) + 1)
                .map((next) => (
                  <h5 className="news__change-title">{next.title}</h5>
                ))}
            </Link>
          </div>
        </div>
      </>
    ));
  return (
    <main className="main">
      <section>
        <div className="container">{showNews}</div>
      </section>
    </main>
  );
};

export default NewsRead
