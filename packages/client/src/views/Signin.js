/* eslint-disable react/prop-types */
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "react-query";
import axios from "axios";
import { LoginUser } from "src/context/action/actions";
import { store } from "src/context/store";
import { css } from "@emotion/core";
import BeatLoader from "react-spinners/BeatLoader";
import UseForm from "../hooks/useForm";
import Errors from "./Errors";
import FacebookAuth from "./FacebookAuth";
import GoogleAuth from "./GoogleAuth";

const override = css`
  display: block;
  margin: 0 auto;
  text-align: center;
`;

const SignIn = (props) => {
  const { dispatch } = useContext(store);

  console.log(props.location.next);

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
        // if (props.location.next) {
        //   authData = { ...authData, path: props.location.next || "/dashboard" };
        // }
        dispatch(LoginUser(authData));
        if (props.location.next) {
          return props.history.push(props.location.next);
        }
        // props.history.push("/dashboard");
      },
    });
    reset();
  };
  return (
    <div className="container mx-auto pt-76 lg:pt-32">
      <div className="flex justify-center">
        <div className="w-full lg:w-1/2 bg-white p-8 sm:p-16">
          <div className="">
            <h1 className="mb-6 text-3xl font-bold text-center">
              Sign In For ShareBook
            </h1>

            {props.location &&
              props.location.state &&
              props.location.state.message && (
                <div
                  className="max-w-xs mx-auto bg-red-100 border border-red-400 text-red-700 px-2 py-2 rounded relative mb-3 text-xs"
                  role="alert"
                >
                  <strong className="font-bold">Expired!</strong>
                  <span className="block sm:inline">
                    {props.location &&
                      props.location.state &&
                      props.location.state.message}
                  </span>
                </div>
              )}

            <div className="mx-auto w-full max-w-xs">
              <GoogleAuth path={props.location.next || null} />

              <FacebookAuth />
            </div>

            <Link to="/signup">
              <button
                type="submit"
                className="mx-auto w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow mt-5"
              >
                <i className="fa fa-user-plus fa 1x w-6 mr-4 text-indigo-500" />
                <span className="-ml-1">Sign Up</span>
              </button>
            </Link>

            <div className="my-12 border-b text-center">
              <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                Or sign in with email
              </div>
            </div>

            {error &&
              error.response.data.errors.map((e, i) => (
                <Errors key={i} error={e} />
              ))}

            {isLoading && (
              <div className="sweet-loading max-w-xs mx-auto">
                <BeatLoader css={override} size={15} color="#38a169" />
              </div>
            )}

            <form className="text-green-500" onSubmit={onSubmitHandler}>
              <div className="mx-auto max-w-xs">
                <input
                  className="mb-4 w-full px-8 py-4 rounded-lg font-medium bg-gray-100 bgray-200 placeholder-gray-500 text-sm focus:outline-none focus: border-gray-400 focus:bg-white"
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={values.email}
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
                    <span className="-ml-1">Sign In</span>
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
        </div>

        <div className="flex-1 bg-green-400 text-center hidden lg:flex">
          <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat signinbg" />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
