import React from "react";
import Aside from "../components/Aside";
import Hero from "../components/Hero";
import HomeSite from "../components/HomeSite";

import "../styles/Main.scss";

const Home = () => {
  return (
    <>
      <section className="main__wrapper">
        <Hero />
        <HomeSite />
        <section className="main__aside-mobile">
          <div className="main__aside-box">
            <Aside />
          </div>
        </section>
      </section>
      <section className="main__aside">
        <div className="main__aside-box">
          <Aside />
        </div>
      </section>
    </>
  );
};

export default Home;
