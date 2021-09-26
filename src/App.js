import { useState } from "react";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import Stats from "./pages/Stats";
import History from "./pages/History";
import News from "./pages/News";
import NewsRead from "./components/NewsRead";
import Tv from "./pages/Tv";
import Team from "./pages/Team";
import Sidebar from "./components/Sidebar";
import TeamSite from "./components/TeamSite";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./styles/Styles.scss";

export default function App() {
  const [activeSidebar, setActiveSidebar] = useState(true);
  return (
    <div className="App">
      <Router>
        {/* <Menu
          activeSidebar={activeSidebar}
          setActiveSidebar={setActiveSidebar}
        /> */}
        <Sidebar
          activeSidebar={activeSidebar}
          setActiveSidebar={setActiveSidebar}
        />
        <main className="main">
          <Nav />
          <section className="main__container">
            <Switch>
              <Route exact path={["/", "/home"]} component={Home} />
              <Route path="/stats" component={Stats} />
              <Route path="/history" component={History} />
              <Route exact path="/news" component={News} />
              <Route path="/news/:id" component={NewsRead} />
              <Route path="/tv" component={Tv} />
              <Route exact path="/team" component={Team} />
              <Route path="/team/:team" component={TeamSite} />
            </Switch>
          </section>
        </main>
      </Router>
    </div>
  );
}
