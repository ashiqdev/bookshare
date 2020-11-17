import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { store } from "src/context/store";

import BeatLoader from "react-spinners/BeatLoader";
import { css } from "@emotion/core";

import setAuthToken from "src/utils/setAuthToken";
import axios from "axios";
import BookList from "./BookList";

const override = css`
  display: block;
  margin: 0 auto;
  text-align: center;
`;

const FetchCurrentUser = async () => {
  setAuthToken(localStorage.token);
  const {
    data: { user },
  } = await axios.get(`${process.env.API_URL}/api/users/auth`);

  return user;
};

// const FetchPosts = async (key, option) => {
//   console.log({ option });
//   const {
//     data: { posts },
//   } = await axios.get(`${process.env.API_URL}/api/posts`, {
//     params: {
//       filter: option,
//     },
//   });

//   return posts;
// };

const DashBoard = () => {
  const [criteria, setCriteria] = useState("");

  useQuery("user", FetchCurrentUser);
  // const { data, status, refetch } = useQuery(["posts", criteria], FetchPosts);

  const FetchPosts = async (key) => {
    const {
      data: { posts },
    } = await axios.get(`${process.env.API_URL}/api/posts`, {
      params: {
        filter: criteria,
      },
    });

    return posts;
  };
  const { data, status, refetch } = useQuery("posts", FetchPosts);

  useEffect(() => {
    refetch();
  }, [criteria]);

  console.log({ data });

  return (
    <div className="bg-gray-300 w-full">
      <div className="flex flex-col container mx-auto mt-6 lg:mt-6 pt-64 sm:pt-32 bg-gray-300 overflow-hidden">
        {/* <!-- SORT BY --> */}
        <div className="flex">
          <div className="inline-block text-left ml-auto">
            <div className="flex items-center">
              <span className="mr-2 text-gray-700">Sort By:</span>
              <span className="rounded-md shadow-md z-30">
                <select
                  name="filter"
                  className="block w-full bg-white border border-gray-200 text-gray-700 py-3 px-1 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="filter"
                  value={criteria}
                  onChange={async (e) => {
                    setCriteria(e.target.value);
                  }}
                >
                  <option>Default</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </span>
            </div>
          </div>
        </div>

        {/* <!-- ITEMS --> */}
        <div className=" px-3 sm:px-4 lg:px-0">
          {status === "loading" && (
            <div className="sweet-loading max-w-xs mx-auto">
              <BeatLoader css={override} size={15} color="#38a169" />
            </div>
          )}
          {data?.posts?.map((post) => (
            <BookList key={post._id} post={post} />
          ))}
        </div>

        {/* <!-- PAGINATION --> */}
        {status === "success" && (
          <div className="mx-auto p-12">
            <nav className="relative z-0 inline-flex shadow-sm">
              <a
                href="#"
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150"
                aria-label="Previous"
              >
                {/* <!-- Heroicon name: chevron-left --> */}
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="-ml-px text-sm relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-s, leading-5 font-medium text-gray-700 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
              >
                1
              </a>
              <a
                href="#"
                className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
              >
                2
              </a>
              <a
                href="#"
                className="hidden md:inline-flex -ml-px relative items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
              >
                3
              </a>
              <span className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-700">
                ...
              </span>
              <a
                href="#"
                className="hidden md:inline-flex -ml-px relative items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
              >
                8
              </a>
              <a
                href="#"
                className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
              >
                9
              </a>
              <a
                href="#"
                className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
              >
                10
              </a>
              <a
                href="#"
                className="-ml-px relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150"
                aria-label="Next"
              >
                {/* <!-- Heroicon name: chevron-right --> */}
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashBoard;
