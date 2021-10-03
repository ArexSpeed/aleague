import { useContext, useState, useEffect } from "react";
import { Context } from "../context/Provider";
import { useParams } from "react-router-dom";
import Aside from "../components/Aside";
import { news } from "../data/news";
import NewsCard from "../components/NewsCard";

function NewsRead() {
  const [{ darkTheme }] = useContext(Context);
  const { id } = useParams();
  const [article, setArticle] = useState();

  useEffect(() => {
    const name = news.find((item) => item.id === +id);
    setArticle(name);
  }, [id]);

  return (
    <>
      <section className="main__wrapper">
        <section className={`section ${darkTheme && "dark"}`}>
          <div className="newsRead">
            <img className="newsRead__image" src={article?.img} alt="" />
            <div className={`news__title ${darkTheme && "dark"}`}>
              {article?.title}
            </div>
            <div className={`news__text ${darkTheme && "dark"}`}>
              {article?.desc}
            </div>
            <div className={`news__text ${darkTheme && "dark"}`}>
              {article?.content}
            </div>
          </div>
          <article className="subsection">
            <div className="subsection__square"></div>
            <div className="subsection__title">Similar News</div>
          </article>
          <div className="subsection__news">
            {news
              .filter((item) => item.category === article?.category)
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

export default NewsRead;
