import avatar from "src/assets/icons/placeholder.png";
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { queryCache, useQuery } from "react-query";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { store } from "src/context/store";
import { ToggleBox, ToggleSellForm } from "src/context/action/actions";
import { TOGGLE_MODAL } from "src/context/action/actionTypes";
import axios from "axios";
import setAuthToken from "src/utils/setAuthToken";
import SigninIcon from "src/assets/icons/enter.svg";
import SignupIcon from "src/assets/icons/reg.svg";
import Logo from "../assets/images/boilogo.png";
import DropDown from "./DropDown";
import Search from "./Search";

import PlusIcon from "../assets/icons/pllus.svg";

const FetchCurrentUser = async () => {
  setAuthToken(localStorage.token);
  const {
    data: { user },
  } = await axios.get(`${process.env.API_URL}/api/users/auth`);

  return user;
};

const Header = () => {
  const updatedUser = queryCache.getQueryData("user");
  const { state, dispatch } = useContext(store);
  // console.log({ jamunaNow: state && state });

  useQuery("user", FetchCurrentUser);

  const guestLinks = (
    <>
      <div className="ml-5 -mt-3 mb-6 lg:mb-0 bg-gray-400 flex items-center justify-center rounded-full p-2 h-10 w-10 hover:bg-gray-500">
        <Tippy content="Sign In">
          <Link to="/signin">
            <img
              src={SigninIcon}
              alt="Icon"
              className="focus:outline-none mr-2 sm:mr-0 w-10"
            />
          </Link>
        </Tippy>
      </div>

      <div className="ml-5 -mt-3 mb-6 lg:mb-0 bg-gray-400 flex items-center justify-center rounded-full p-2 h-10 w-10 hover:bg-gray-500">
        <Tippy content="Sign Up">
          <Link to="/signup">
            <img
              src={SignupIcon}
              alt="Icon"
              className="focus:outline-none mr-2 sm:mr-0 w-10"
            />
          </Link>
        </Tippy>
      </div>
    </>
  );

  const authLinks = (
    <>
      <a
        href="#"
        onClick={() => {
          if (updatedUser.completed === "true") {
            dispatch(ToggleSellForm());
          }
          // if user profile is not completed than show him the update profile form
          dispatch({
            type: TOGGLE_MODAL,
            payload: "You have to complete profile in order to create a post",
          });
        }}
      >
        <Tippy content="Post an Ad">
          <div className="ml-5 -mt-3 mb-6 lg:mb-0 bg-gray-400 flex items-center justify-center rounded-full p-2 h-8 w-8 lg:h-10 lg:w-10  hover:bg-gray-500">
            <img
              src={PlusIcon}
              alt="Icon"
              className="focus:outline-none mr-2 sm:mr-0 lg:w-10 w-8"
            />
          </div>
        </Tippy>
      </a>

      <div className="ml-5 -mt-3 mb-6 lg:mb-0  flex items-center justify-center rounded-full h-8 w-8 lg:h-10 lg:w-10  hover:bg-gray-500">
        <Tippy content="Profile">
          <a href="#" onClick={() => dispatch(ToggleBox())}>
            <img
              src={updatedUser?.image ? updatedUser.image : avatar}
              alt="Icon"
              className="mr-2 sm:mr-0 rounded-full"
            />
          </a>
        </Tippy>

        {state?.box && <DropDown />}
      </div>

      {/* <div className="ml-5 mb-6 lg:mb-0 -mt-3 relative z-100 h-12 lg:h-auto">
        <button
          type="submit"
          className="bg-green-500 text-white py-3 sm:px-5 sm:py-4 rounded-lg text-lg sm:text-xl shadow-md hover:bg-green-600 focus:outline-none w-24 sm:w-40 -mt-3 sm:-mt-0 mr-2 sm:mr-0"
          // onClick={() => dispatch(ToggleBox())}
          onClick={() => {
            dispatch(ToggleBox());
          }}
        >
          {state && state.user && captitalize(state.user.name.split(" ")[0])}
        </button>
        {state && state.box && <DropDown />}
      </div> */}
      {/* 
      <div className='ml-5 mb-6 lg:mb-0 -mt-3 relative z-100 h-12 lg:h-auto'>
        <button
          type='submit'
          className='bg-green-500 text-white py-3 sm:px-5 sm:py-4 rounded-lg text-lg sm:text-xl shadow-md hover:bg-green-600 focus:outline-none w-24 sm:w-40 -mt-3 sm:-mt-0 mr-2 sm:mr-0'
          // dispatch({ type: AUTH_ERROR });
          onClick={() => dispatch({ type: LOG_OUT })}
        >
          Log Out
        </button>
      </div> */}
    </>
  );

  return (
    <div className="bg-gray-300 w-full">
      <div className="flex flex-col sm:flex-row p-6 items-center fixed w-full top-0 z-50 h-auto sm:h-16 bg-gray-100">
        {/* BRAND LOGO/Name */}
        <Link to="/dashboard">
          <div className="mr-8 ml-0">
            <img
              className="w-24 h-20 sm:w-full sm:h-full"
              src={Logo}
              alt="Boi"
            />
          </div>
        </Link>
        {/* SEARCH SECTION */}
        <div className="w-full lg:w-3/12 relative mr-0 sm:mr-auto mt-3 lg:mt-1 mb-4 lg:mb-0">
          <Search />
        </div>

        {/* NAVIGTATION SECTION */}
        <div className="flex flex-row items-center align-middle  mt-6 lg:mt-3 justify-center">
          {state && state.isAuthenticated ? authLinks : guestLinks}
        </div>
      </div>
    </div>
  );
};

export default Header;
