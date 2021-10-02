import { useContext } from "react";
import { Context } from "../context/Provider";
import Aside from "../components/Aside";
import HeroNews from "../components/HeroNews";
import NewsSite from "../components/NewsSite";

const News = () => {
  const [{ darkTheme }] = useContext(Context);
  return (
    <>
      <section className="main__wrapper">
        <HeroNews />
        <NewsSite />
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
};

export default News;
