/* eslint-disable react/prop-types */
import React, { useContext } from "react";
import { useMutation } from "react-query";
import axios from "axios";
import { css } from "@emotion/core";
import BeatLoader from "react-spinners/BeatLoader";
import { LoginUser } from "src/context/action/actions";
import { Link } from "react-router-dom";
import makeToast from "src/component/Toaster";
// import Spinner from "src/component/Spinner";
import UseForm from "src/hooks/useForm";
import { store } from "../context/store";
import Errors from "./Errors";

const override = css`
  display: block;
  margin: 0 auto;
  text-align: center;
`;

const ReSignin = ({ location: { message } }) => {
  const { dispatch } = useContext(store);

  const { API_URL } = process.env;
  const [values, onChangeHandler, reset] = UseForm({
    email: "",
    password: "",
  });

  const [signInMutate, { isLoading, error }] = useMutation((value) =>
    axios.post(`${API_URL}/api/users/login`, value)
  );

  const onSubmitHandler = (e) => {
    e.preventDefault();
    signInMutate(values, {
      onSuccess: (data) => {
        const { data: authData } = data;
        dispatch(LoginUser(authData));
        makeToast("success", "successfully signed in");
      },
    });
    reset();
  };

  return (
    <div className="container mx-auto pt-8 sm:pt-24">
      <div className="flex sm:h-128">
        <div className="lg:w-1/2 bg-white p-8 sm:p-16">
          <div>
            <h1 className="mb-6 text-3xl font-bold text-center">
              Sign In For ShareBook
            </h1>
            {error &&
              error.response.data.errors.map((e, i) => (
                <Errors key={i} error={e} />
              ))}

            {isLoading && (
              <div className="sweet-loading max-w-xs mx-auto">
                <BeatLoader css={override} size={15} color="#38a169" />
                {/* <Spinner /> */}
              </div>
            )}
          </div>

          {message && (
            <div className="text-center py-4 lg:px-4">
              <div
                className="p-2 text-sm bg-green-100 border-green-400 items-center font-semibold text-green-700 leading-none lg:rounded flex lg:inline-flex"
                role="alert"
              >
                <span className=" mr-2 text-left flex-auto text-sm">
                  {message}
                </span>
              </div>
            </div>
          )}

          <form className="text-green-500" onSubmit={onSubmitHandler}>
            <div className="mx-auto max-w-xs">
              <input
                className="mb-4 w-full px-8 py-4 rounded-lg font-medium bg-gray-100 bgray-200 placeholder-gray-500 text-sm focus:outline-none focus: border-gray-400 focus:bg-white"
                type="email"
                placeholder="Email"
                value={values.email}
                name="email"
                onChange={onChangeHandler}
              />

              <input
                className="mb-4 w-full px-8 py-4 rounded-lg font-medium bg-gray-100 bgray-200 placeholder-gray-500 text-sm focus:outline-none focus: border-gray-400 focus:bg-white"
                type="password"
                placeholder="Password"
                name="password"
                value={values.password}
                onChange={onChangeHandler}
              />

              <div className="flex flex-col items-center">
                <button
                  type="submit"
                  className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow mt-5"
                >
                  <i className="fa fa-user-plus fa 1x w-6 mr-4 text-indigo-500" />
                  <span className="">Sign In</span>
                </button>
              </div>
              <div className="text-right mt-2">
                <Link
                  to="/forget"
                  className="text-indigo-500 text-right text-sm mt-2 cursor-pointer"
                >
                  forget password?
                </Link>
              </div>
            </div>
          </form>
        </div>

        {/* <!-- image --> */}
        <div className="flex-1 bg-green-400 text-center hidden lg:flex">
          <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat successbg" />
        </div>
      </div>
    </div>
  );
};

export default ReSignin;
