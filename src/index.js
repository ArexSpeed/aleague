import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "./context";

import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  rootElement
);
