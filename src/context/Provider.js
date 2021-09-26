import { createContext, useReducer } from "react";
import reducer, { initialState } from "./reducer";

export const Context = createContext();

export const Provider = ({ children }) => (
  <Context.Provider value={useReducer(reducer, initialState)}>
    {children}
  </Context.Provider>
);
