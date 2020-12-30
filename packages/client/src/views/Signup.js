/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "react-query";
import axios from "axios";
import { css } from "@emotion/core";
import BeatLoader from "react-spinners/BeatLoader";
import makeToast from "src/component/Toaster";

import UseForm from "../hooks/useForm";
import Errors from "./Errors";

const override = css`
  display: block;
  margin: 0 auto;
  text-align: center;
`;

const Signup = () => {
  const { API_URL } = process.env;
  const [tempEmail, setTempEmail] = useState("");
  const [values, onChangeHandler, reset] = UseForm({
    name: "",
    email: "",
    password: "",
  });

  const [signupMutate, { status, data, error }] = useMutation((value) =>
    axios.post(`${API_URL}/api/users/register`, value)
  );

  const [resendMutate, { isLoading, isSuccess }] = useMutation((email) =>
    axios.post(`${API_URL}/api/users/sendVerification`, email)
  );
  return (
    <div className="container mx-auto pt-76 lg:pt-32">
      <div className="flex justify-center">
        <div className="w-full lg:w-1/2  bg-white p-8 sm:p-24 ">
          <div className="">
            <h1 className="mb-6 text-3xl font-bold text-center">
              Sign Up For ShareBook
            </h1>

            {error &&
              error.response.data.errors.map((e, i) => (
                <Errors key={i} error={e} />
              ))}

            {status === "loading" && (
              <div className="sweet-loading max-w-xs mx-auto">
                <BeatLoader css={override} size={15} color="#38a169" />
              </div>
            )}

            {status === "success" && (
              <div className="text-center py-4 lg:px-4">
                <div
                  className="p-2 text-sm bg-green-100 border-green-400 items-center font-semibold text-green-700 leading-none lg:rounded flex lg:inline-flex"
                  role="alert"
                >
                  <span className=" mr-2 text-left flex-auto text-sm">
                    {data.data.message}
                  </span>

                  <button
                    type="submit"
                    onClick={() => resendMutate({ email: tempEmail })}
                    className="flex rounded-full bg-indigo-500 text-white uppercase px-2 py-1 text-xs font-bold mr-3 focus:outline-none"
                  >
                    {/* const drink = dislikeCoke ? 'fanta' : likesCherry ? 'cherryCoke' : 'dietCoke'; */}
                    <span>{`Resen${
                      // eslint-disable-next-line no-nested-ternary
                      isLoading ? "ding" : isSuccess ? "t" : "d"
                    }`}</span>
                  </button>
                </div>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setTempEmail(values.email);
                signupMutate(values);
                reset();
                isSuccess && makeToast("success", "Successfully registered");
              }}
              className="text-green-500"
            >
              <div className="mx-auto max-w-xs">
                <input
                  className="mb-4 w-full px-8 py-4 rounded-lg font-medium bg-gray-100 bgray-200 placeholder-gray-500 text-sm focus:outline-none focus: border-gray-400 focus:bg-white"
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={values.name}
                  onChange={onChangeHandler}
                />
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
                <button
                  type="submit"
                  className="mt-5 tracking-wide font-semibold bg-green-500 text-gray-100 w-full py-4 rounded-lg hover:bg-green-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none border-none outline-none"
                >
                  <i className="fa fa-user-plus fa 1x w-6 -ml-2" />
                  <span className="ml-3">Sign Up</span>
                </button>
              </div>

              <div className="my-12 border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  Or sign in with email or social login
                </div>
              </div>

              <div className="flex flex-col items-center">
                <Link
                  to="/signin"
                  href="#"
                  className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow mt-5"
                >
                  <i className="fa fa-user-plus fa 1x w-6 mr-4 text-indigo-500" />
                  <span>Sign In</span>
                </Link>
              </div>
            </form>
          </div>
        </div>
        <div className="flex-1 bg-green-400 text-center hidden lg:flex">
          <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat signupbg" />
        </div>
      </div>
    </div>
  );
};

export default Signup;
