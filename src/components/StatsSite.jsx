import { useContext } from "react";
import { Context } from "../context/Provider";
import { Link } from "react-router-dom";
import Table from "./Table";
import TableStats from "./TableStats";

const StatsSite = () => {
  const [{ darkTheme }] = useContext(Context);
  return (
    <>
      <section className={`section ${darkTheme && "dark"}`}>
        <div className="section__title">
          <div className="section__title-name">Standings</div>
        </div>
        <div className="subsection__table">
          <TableStats />
        </div>
        <div className="section__title">
          <div className="section__title-name">Fixtures</div>
        </div>
      </section>
    </>
  );
};

export default StatsSite;
