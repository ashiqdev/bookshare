// import { useContext } from "react";
// import axios from "axios";
// import { store } from "src/context/store";
// import { AUTH_ERROR, USER_LOADED } from "src/context/action/actionTypes";
// import setAuthToken from "./setAuthToken";

// const { API_URL } = process.env;

// // eslint-disable-next-line import/prefer-default-export
// export const loadUser = () => async () => {
//   const { dispatch } = useContext(store);
//   if (localStorage.token) {
//     setAuthToken(localStorage.token);
//   }

//   try {
//     const res = await axios.get(`${API_URL}/api/auth`);
//     console.log({ res });

//     dispatch({ type: USER_LOADED, payload: res.data });
//   } catch (error) {
//     dispatch({ type: AUTH_ERROR });
//   }
// };
