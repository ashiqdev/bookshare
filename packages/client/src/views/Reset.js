import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import queryString from "query-string";
import axios from "axios";
import { css } from "@emotion/core";
import BeatLoader from "react-spinners/BeatLoader";
import { Redirect } from "react-router-dom";
import UseForm from "../hooks/useForm";
import Errors from "./Errors";

const override = css`
  display: block;
  margin: 0 auto;
  text-align: center;
`;

const Reset = (props) => {
  const { location, history } = props;

  const [values, onChangeHandler, reset] = UseForm({
    password: "",
    confirmPassword: "",
  });

  const { resetToken } = queryString.parse(location.search);

  const [resetMutate, { status, data, error }] = useMutation((value) =>
    axios.post(`${process.env.API_URL}/api/users/reset`, value)
  );

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const body = {
      resetToken,
      password: values.password,
      confirmPassword: values.confirmPassword,
    };
    resetMutate(body);

    reset();
  };

  return (
    <div className="container mx-auto pt-8 sm:pt-24">
      <div className="flex sm:h-128">
        <div className="lg:w-1/2 bg-white p-8 sm:p-16">
          <div>
            <h1 className="mb-6 text-3xl font-bold text-center">
              Reset Password
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
              <Redirect
                to={{ pathname: "/success", message: data.data.message }}
              />
            )}
          </div>

          <form className="text-green-500" onSubmit={onSubmitHandler}>
            <div className="mx-auto max-w-xs">
              <input
                className="mb-4 w-full px-8 py-4 rounded-lg font-medium bg-gray-100 bgray-200 placeholder-gray-500 text-sm focus:outline-none focus: border-gray-400 focus:bg-white"
                type="password"
                placeholder="password"
                name="password"
                value={values.password}
                onChange={onChangeHandler}
              />

              <input
                className="mb-4 w-full px-8 py-4 rounded-lg font-medium bg-gray-100 bgray-200 placeholder-gray-500 text-sm focus:outline-none focus: border-gray-400 focus:bg-white"
                type="password"
                placeholder="confirm pasword"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={onChangeHandler}
              />

              <div className="flex flex-col items-center">
                <button
                  type="submit"
                  className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-green-500 text-white flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow mt-5 hover:bg-green-600"
                >
                  <i className="fa fa-user-plus fa 1x w-6 mr-4 text-white" />
                  <span className="-ml-1">Submit</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="flex-1 bg-green-400 text-center hidden lg:flex">
          <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat resetbg" />
        </div>
      </div>
    </div>
  );
};

export default Reset;
