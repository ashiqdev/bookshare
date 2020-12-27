import React, { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useInfiniteQuery } from "react-query";

import setAuthToken from "src/utils/setAuthToken";
import axios from "axios";
import SkeletonPosts from "src/skeletons/SkeletonPosts";
import BookDetails from "./BookDetails";

const FetchCurrentUser = async () => {
  setAuthToken(localStorage.token);
  const {
    data: { user },
  } = await axios.get(`${process.env.API_URL}/api/users/auth`);

  return user;
};

const DashBoard = () => {
  const [criteria, setCriteria] = useState("");

  useQuery("user", FetchCurrentUser);

  const FetchPosts = async (key, page = 1) => {
    const {
      data: { posts },
    } = await axios.get(`${process.env.API_URL}/api/posts`, {
      params: {
        filter: criteria,
        pageOffset: page,
        limit: 4,
      },
    });

    return posts;
  };

  const {
    data,
    status,
    refetch,
    fetchMore,
    canFetchMore,
    isLoading,
  } = useInfiniteQuery("posts", FetchPosts, {
    getFetchMore: (lastPage) => lastPage.next,
  });

  // infinite scroll
  const observer = useRef();
  const lastBookElementRef = useCallback((node) => {
    // we dont want to fetch data when state is loading
    if (isLoading) return;
    // because we will reconnect later
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && canFetchMore) {
        // It will fetch the next page's data
        fetchMore();
      }
    });

    if (node) observer.current.observe(node);
  });

  useEffect(() => {
    refetch();
  }, [criteria]);

  return (
    <div className="bg-gray-300 w-full pt-76 sm:pt-0">
      <div className="flex flex-col container mx-auto mt-6 lg:mt-6 sm:pt-32 bg-gray-300 overflow-hidden">
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
          {status === "loading" &&
            [1, 2, 3, 4].map((n) => <SkeletonPosts key={n} />)}

          {data &&
            data.map((page) => {
              return (
                <>
                  {page.posts.map((post, index) => {
                    if (page.posts.length === index + 1) {
                      return (
                        <BookDetails
                          reference={lastBookElementRef}
                          key={post._id}
                          post={post}
                        />
                      );
                    }
                    return <BookDetails key={post._id} post={post} />;
                  })}
                </>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
