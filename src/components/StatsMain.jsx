import React from "react";
import Table from "./Table";
import { Link } from "react-router-dom";

import "../styles/Section.scss";
import Fixtures from "./Fixtures";

function StatsMain() {
  return (
    <>
      <section id="table">
        <div className="sectionLine">
          <span className="sectionLine__title">Table</span>
        </div>
        <div className="container">
          <Table />
        </div>
      </section>
      <section className="fixturesSec" id="fixtures">
        <div className="sectionLine">
          <span className="sectionLine__title">Fixtures</span>
        </div>
        <div className="container">
          <Fixtures />
        </div>
      </section>
    </>
  );
}

export default StatsMain;
