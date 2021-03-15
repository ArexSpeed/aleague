import React, { createContext } from "react";

export const Context = createContext();

export const Provider = ({ children }) => {
  const url = "https://aleague.herokuapp.com";
  return <Context.Provider value={{ url }}>{children}</Context.Provider>;
};
