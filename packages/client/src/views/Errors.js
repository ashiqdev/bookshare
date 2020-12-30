/* eslint-disable react/prop-types */
import React from "react";

const Error = ({ error }) => {
  Object.entries(error).map(([key, value]) => {
    return (
      <p>
        {key} : {value.toString()}
      </p>
    );
  });

  return (
    <>
      {Object.entries(error).map(([key, value]) => {
        return (
          <div
            className="max-w-xs mx-auto bg-red-100 border border-red-400 text-red-700 px-2 py-2 rounded relative mb-3 text-xs"
            role="alert"
          >
            <strong className="font-bold">{key}!</strong>
            <span className="block sm:inline">{value}</span>
          </div>
        );
      })}
    </>
  );
};

export default Error;
