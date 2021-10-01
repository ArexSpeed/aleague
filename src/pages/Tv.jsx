import { useContext } from "react";
import { Context } from "../context/Provider";
import Aside from "../components/Aside";
import Hero from "../components/Hero";
import HomeSite from "../components/HomeSite";

const Tv = () => {
  const [{ darkTheme }] = useContext(Context);
  return (
    <>
      <section className="main__wrapper">
        <section className={`section ${darkTheme && "dark"}`}>
          <div className="tv__title">
            <p>Every second of your favorite games in one place.</p>
            <p>Choose your plan and enjoy best football league.</p>
          </div>
          <div className="tableContainer">
            <table className="tv__table">
              <thead></thead>
              <tbody>
                <tr>
                  <td className={darkTheme && "dark"}></td>
                  <td className="basic">
                    <div className="tv__box">
                      <div className="tv__box-title">Basic</div>
                      <div className="tv__box-price">
                        $5 / <span>month</span>
                      </div>
                    </div>
                  </td>
                  <td className="fan">
                    <div className="tv__box">
                      <div className="tv__box-title">FAN</div>
                      <div className="tv__box-price">
                        $10 / <span>month</span>
                      </div>
                    </div>
                  </td>
                  <td className="vip">
                    <div className="tv__box">
                      <div className="tv__box-title">VIP</div>
                      <div className="tv__box-price">
                        $20 / <span>month</span>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className={darkTheme && "dark"}>Game highlights</td>
                  <td className={darkTheme && "dark"}>5min</td>
                  <td className={darkTheme && "dark"}>10min</td>
                  <td className={darkTheme && "dark"}>15min</td>
                </tr>
                <tr>
                  <td className={darkTheme && "dark"}>External studio</td>
                  <td className={darkTheme && "dark"}>-</td>
                  <td className={darkTheme && "dark"}>+</td>
                  <td className={darkTheme && "dark"}>+</td>
                </tr>
                <tr>
                  <td className={darkTheme && "dark"}>Advanced Statistics</td>
                  <td className={darkTheme && "dark"}>-</td>
                  <td className={darkTheme && "dark"}>+</td>
                  <td className={darkTheme && "dark"}>+</td>
                </tr>
                <tr>
                  <td className={darkTheme && "dark"}>Games Replay</td>
                  <td className={darkTheme && "dark"}>to 7 days</td>
                  <td className={darkTheme && "dark"}>to 30 days</td>
                  <td className={darkTheme && "dark"}>all season</td>
                </tr>
                <tr>
                  <td className={darkTheme && "dark"}>Multiroom</td>
                  <td className={darkTheme && "dark"}>1 device</td>
                  <td className={darkTheme && "dark"}>2 devices</td>
                  <td className={darkTheme && "dark"}>5 devices</td>
                </tr>
                <tr>
                  <td className={darkTheme && "dark"}>Bonus to shop</td>
                  <td className={darkTheme && "dark"}>no</td>
                  <td className={darkTheme && "dark"}>5%</td>
                  <td className={darkTheme && "dark"}>10%</td>
                </tr>
                <tr>
                  <td className={darkTheme && "dark"}></td>
                  <td className="basic">
                    <button className="tv__button">Select</button>
                  </td>
                  <td className="fan">
                    <button className="tv__button">Select</button>
                  </td>
                  <td className="vip">
                    <button className="tv__button">Select</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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

export default Tv;
