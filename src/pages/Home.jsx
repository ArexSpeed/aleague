import React from "react";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import HomeSite from "../components/HomeSite";

import "../styles/Main.scss";

const Home = () => {
  return (
    <>
      <section className="main__wrapper">
        <Banner />
        <HomeSite />
        <Footer />
      </section>
      <section className="main__aside">
        <div className="main__aside-box">xD</div>
      </section>
    </>
  );
};

export default Home;
