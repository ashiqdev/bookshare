import React, { useState } from "react";
import { useMutation } from "react-query";
import axios from "axios";
import BeatLoader from "react-spinners/BeatLoader";
import { css } from "@emotion/core";
import UseForm from "../hooks/useForm";
import Errors from "./Errors";

const override = css`
  display: block;
  margin: 0 auto;
  text-align: center;
`;

const Forget = () => {
  const { API_URL } = process.env;
  const [tempEmail, setTempEmail] = useState("");
  const [values, onChangeHandler, reset] = UseForm({
    email: "",
  });

  const [
    forgetMutate,
    { status, data, error, isLoading, isSuccess },
  ] = useMutation((value) =>
    axios.post(`${process.env.API_URL}/api/users/forget`, value)
  );

  // const [resendMutate, { isLoading, isSuccess }] = useMutation((email) =>
  //   axios.post(`${API_URL}/api/users/forget`, email)
  // );

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setTempEmail(values.email);
    forgetMutate(values);
    reset();
  };

  return (
    <div className="container mx-auto pt-8 sm:pt-24">
      <div className="flex sm:h-128">
        <div className="lg:w-1/2 bg-white p-8 sm:p-16">
          <div>
            <h1 className="mb-6 text-3xl font-bold text-center">
              Forget Password
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
                    onClick={() => forgetMutate({ email: tempEmail })}
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
          </div>

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
          <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat forgetbg" />
        </div>
      </div>
    </div>
  );
};

export default Forget;
