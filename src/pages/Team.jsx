import { useContext } from "react";
import { Context } from "../context/Provider";
import Aside from "../components/Aside";
import Hero from "../components/Hero";
import HomeSite from "../components/HomeSite";
import TeamInfo from "../components/TeamInfo";

function Team() {
  const [{ darkTheme }] = useContext(Context);
  return (
    <>
      <section className="main__wrapper">
        <TeamInfo />
        <HomeSite />
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

export default Team;
