import React, { useEffect, useContext } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import setAuthToken from "src/utils/setAuthToken";
import { store } from "src/context/store";
import axios from "axios";
import { AUTH_ERROR, USER_LOADED } from "src/context/action/actionTypes";
import { useQuery } from "react-query";
import SinglePost from "src/views/SinglePost";
import Signin from "../Signin";
import Signup from "../Signup";
import Verify from "../Verify";
import Header from "../Header";
import ReSignin from "../ReSignin";
import Forget from "../Forget";
import Reset from "../Reset";
import DashBoard from "../DashBoard";
import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";
import ProfileModal from "../ProfileModal";
import FormModal from "../FormModal";

// const FetchPosts = async () => {
//   const {
//     data: { posts },
//   } = await axios.get(`${process.env.API_URL}/api/posts`);

//   return posts;
// };

const RouterController = () => {
  // useQuery("posts", FetchPosts);

  const { dispatch, state } = useContext(store);
  useEffect(() => {
    // check for token in LS
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    const getUser = async () => {
      try {
        const res = await axios.get(`${process.env.API_URL}/api/users/auth`);

        dispatch({ type: USER_LOADED, payload: res.data.user });
      } catch (error) {
        dispatch({ type: AUTH_ERROR });
      }
    };

    getUser();

    if (state.modal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // TODO log user out from all tabs if they log out in one tab
  }, [state.modal]);

  return (
    <Router>
      <div className="flex flex-col lg:bg-gray-300 w-full min-h-screen">
        {state && state.modal && <ProfileModal />}
        {state && state.sellForm && <FormModal />}
        <Header />
        <Switch>
          <PublicRoutes exact path="/" component={DashBoard} />
          <Route exact path="/dashboard" component={DashBoard} />
          <Route exact path="/verify" component={Verify} />
          <PublicRoutes exact path="/signin" component={Signin} />
          <PublicRoutes exact path="/signup" component={Signup} />
          <PublicRoutes exact path="/success" component={ReSignin} />
          <PublicRoutes exact path="/forget" component={Forget} />
          <Route exact path="/reset" component={Reset} />

          <Route exact path="/posts/:id" component={SinglePost} />
        </Switch>
      </div>
    </Router>
  );
};

export default RouterController;
