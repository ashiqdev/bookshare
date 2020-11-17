import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { store } from "src/context/store";

const PublicRoutes = ({ component: Component, ...rest }) => {
  const { state } = useContext(store);
  return (
    <Route
      {...rest}
      component={(props) =>
        state.isAuthenticated ? (
          <Redirect to="/dashboard" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PublicRoutes;
