import { useContext } from "react";
import { Context } from "./context/Provider";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import Stats from "./pages/Stats";
import History from "./pages/History";
import News from "./pages/News";
import NewsRead from "./pages/NewsRead";
import Tv from "./pages/Tv";
import Team from "./pages/Team";
import Sidebar from "./components/Sidebar";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NavMobile from "./components/NavMobile";

export default function App() {
  const [{ mobileSidebar, darkTheme }] = useContext(Context);
  return (
    <div className={`App ${darkTheme && "dark"}`}>
      <Router>
        <Sidebar />
        <main
          className={`main ${mobileSidebar && "hide"} ${darkTheme && "dark"}`}
        >
          <Nav />
          <NavMobile />
          <section className="main__container">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/stats" component={Stats} />
              <Route path="/history" component={History} />
              <Route exact path="/news" component={News} />
              <Route path="/news/:id" component={NewsRead} />
              <Route path="/tv" component={Tv} />
              <Route path="/team/:teamsite" component={Team} />
            </Switch>
          </section>
        </main>
      </Router>
    </div>
  );
}
