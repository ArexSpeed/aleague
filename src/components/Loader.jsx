import React from "react";
import logo from "../images/AL.png";

const Loader = ({ text }) => {
  return (
    <div className="loader">
      <img className="loader__img" src={logo} alt="Loading..." />
      <p>Loading {text}...</p>
    </div>
  );
};

export default Loader;
