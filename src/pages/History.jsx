import { useContext } from "react";
import { Context } from "../context/Provider";
import Aside from "../components/Aside";
import TableHistory from "../components/TableHistory";
import Medals from "../components/Medals";
import H2H from "../components/H2H";

const History = () => {
  const [{ darkTheme }] = useContext(Context);
  return (
    <>
      <section className="main__wrapper">
        <section className={`section ${darkTheme && "dark"}`}>
          <TableHistory />
          <Medals />
          <H2H />
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
};

export default History;
