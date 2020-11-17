/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import queryString from "query-string";
import axios from "axios";
import { Redirect } from "react-router-dom";

const { API_URL } = process.env;

const Verify = (props) => {
  const [redirect, setRedirect] = useState(false);
  const { location, history } = props;

  useEffect(() => {
    const onVerify = async () => {
      try {
        const { token, email } = queryString.parse(location.search);
        await axios.post(`${API_URL}/api/users/verify`, {
          email,
          emailToken: token,
        });

        setRedirect(true);
      } catch (err) {
        const { errors } = err.response.data;
        let msg;
        for (const error of errors) {
          msg = Object.values(error).toString();
        }
        history.push("/signin", { message: msg });
      }
    };
    onVerify();
  }, [history, location.search]);

  if (redirect) {
    return (
      <Redirect
        to={{ pathname: "/success", message: "You are now verified!" }}
      />
    );
  }

  return <p>Loading</p>;
};

export default Verify;
