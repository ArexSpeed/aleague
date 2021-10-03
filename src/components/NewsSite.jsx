import { useContext } from "react";
import NewsCard from "./NewsCard";
import { news } from "../data/news";
import { Context } from "../context/Provider";

const NewsSite = () => {
  const [{ darkTheme }] = useContext(Context);

  return (
    <>
      <section className={`section ${darkTheme && "dark"}`}>
        <div className="section__title">
          <div className="section__title-name">News</div>
        </div>
        <article className="subsection">
          <div className="subsection__square"></div>
          <div className="subsection__title">Latest News</div>
        </article>
        <div className="subsection__news">
          {news
            .filter((item) => item.id <= 5)
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
          <div className="subsection__title">Articles</div>
        </article>
        <div className="subsection__news">
          {news
            .filter((item) => item.category === "Article")
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
          <div className="subsection__title">Reports</div>
        </article>
        <div className="subsection__news">
          {news
            .filter((item) => item.category === "Report")
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
          <div className="subsection__title">Interviews</div>
        </article>
        <div className="subsection__news">
          {news
            .filter((item) => item.category === "Interview")
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
          <div className="subsection__title">Transfers</div>
        </article>
        <div className="subsection__news">
          {news
            .filter((item) => item.category === "Transfer")
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
    </>
  );
};

export default NewsSite;
