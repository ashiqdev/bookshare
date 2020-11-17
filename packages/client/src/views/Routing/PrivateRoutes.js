import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { store } from "src/context/store";

const PrivateRoutes = ({ component: Component, ...rest }) => {
  const { state } = useContext(store);
  return (
    <Route
      {...rest}
      component={(props) =>
        state.isAuthenticated ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};

export default PrivateRoutes;
