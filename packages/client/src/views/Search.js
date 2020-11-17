import React from "react";

const Search = () => {
  return (
    <>
      <input
        className="bg-gray-200 h-10 px-4  text-xs lg:text-lg w-full rounded-lg placeholder-gray-700 lg:-mt-1"
        type="text"
        placeholder="Macbook Pro 2020"
      />
      <span className="flex items-center absolute right-0 inset-y-0 mr-0 sm:mr-3 text-base">
        <i className="fa fa-search text-black" />
      </span>
    </>
  );
};

export default Search;
