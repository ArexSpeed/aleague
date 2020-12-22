import React from "react";
import Banner from "../components/Banner";
import Card from "../components/Card";
import Footer from "../components/Footer";
import LastScores from "../components/LastScores";

import "../styles/Main.scss";

const Home = () => {
  return (
    <main className="main">
      <Banner />
      <LastScores />
      <Footer />
    </main>
  );
};

export default Home;
