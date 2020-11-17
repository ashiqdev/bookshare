import axios from "axios";

const setAuthToken = (token) => {
  //   check if token exists on localStorage
  if (token) {
    axios.defaults.headers.common["x-auth-token"] = token;
  } else {
    delete axios.defaults.headers.common["x-auth-token"];
  }
};

export default setAuthToken;
