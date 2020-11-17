import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import setAuthToken from "src/utils/setAuthToken";

const FetchCurrentUser = async () => {
  setAuthToken(localStorage.token);
  const {
    data: { user },
  } = await axios.get(`${process.env.API_URL}/api/users/auth`);

  return user;
};

const Test = ({ children }) => {
  const { data: updatedUser, isLoading, error: fetchError } = useQuery(
    "user",
    FetchCurrentUser
  );
  return <>{children}</>;
};

export default Test;
