import React, { createContext, useReducer } from "react";
import reducer from "./reducer";

const init = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  user: null,
  box: false,
  modal: false,
  sellForm: false,
  deleteForm: false,
  editForm: false,
  warning: null,
};

const store = createContext();
const { Provider } = store;

// wrappeer

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, init);
  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
