import React from "react";
import Banner from "../components/Banner";
import Card from "../components/Card";
import Footer from "../components/Footer";
import HomeSite from "../components/HomeSite";

import "../styles/Main.scss";

const Home = () => {
  return (
    <main className="main">
      <Banner />
      <HomeSite />
      <Footer />
    </main>
  );
};

export default Home;
