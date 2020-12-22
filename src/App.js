import React from "react";
import Menu from "./components/Menu";
import Home from "./pages/Home";
import Stats from "./pages/Stats";
import History from "./pages/History";
import News from "./pages/News";
import Tv from "./pages/Tv";
import Team from "./pages/Team";
import Sidebar from "./components/Sidebar";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./style.css";
import TeamSite from "./components/TeamSite";


export default function App() {
  return (
    <div className="App">
      <Router>
        <Menu />
        <Sidebar />
        <Switch>
          <Route exact path={["/",'/home']} component={Home} />
          <Route path="/stats" component={Stats} />
          <Route path="/history" component={History} />
          <Route path="/news" component={News} />
          <Route path="/tv" component={Tv} />
          <Route exact path="/team" component={Team} />
          <Route path="/team/:team" component={TeamSite} />
        </Switch>
      </Router>
    </div>
  );
}
