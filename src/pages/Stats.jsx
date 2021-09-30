import { useContext } from "react";
import { Context } from "../context/Provider";
import Aside from "../components/Aside";
import StatsSite from "../components/StatsSite";

const Stats = () => {
  const [{ darkTheme }] = useContext(Context);
  return (
    <>
      <section className="main__wrapper">
        <StatsSite />
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

export default Stats;
