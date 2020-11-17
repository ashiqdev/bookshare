import React, { useState, useContext } from "react";
import { Redirect, useParams, useHistory } from "react-router-dom";
import { useQuery, useMutation, queryCache } from "react-query";
import moment from "moment";
import axios from "axios";
import Errors from "src/views/Errors";
import BeatLoader from "react-spinners/BeatLoader";
import avatar from "src/assets/icons/placeholder.png";
import { css } from "@emotion/core";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import captitalize from "src/utils/captitalize";
import getFirstName from "src/utils/getFirstName";
import { store } from "src/context/store";

import CallIcon from "src/assets/icons/call2.svg";
import EditIcon from "src/assets/icons/edit.svg";
import DeleteIcon from "src/assets/icons/delete-3.svg";

import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  RedditShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  RedditIcon,
} from "react-share";
import { ToggleDeleteForm, ToggleEditForm } from "src/context/action/actions";
import DeleteModal from "./DeleteModal";
import EditModal from "./EditModal";

const { API_URL } = process.env;

const override = css`
  display: block;
  margin: 0 auto;
  text-align: center;
`;

const FetchSinglePost = async (key, id) => {
  const {
    data: { post },
  } = await axios.get(`${process.env.API_URL}/api/posts/${id}`);

  return post;
};

const SinglePost = (props) => {
  const history = useHistory();

  const { state, dispatch } = useContext(store);
  const url = `${process.env.API_URL}${props.location.pathname}`;
  const [reveal, setReveal] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const { id } = useParams();
  const { data, status, error } = useQuery(["post", id], FetchSinglePost);

  const date = new Date(data?.createdAt);

  console.log({ ps: status });

  console.log({ imtiaj: data });

  console.log({ imp: state });

  const [
    deleteMutate,
    { status: deleteStatus, error: deleteError, data: deleteRes },
  ] = useMutation(
    async () => {
      await axios.delete(`${API_URL}/api/posts/${id}`);
    },
    {
      onSuccess: () => {
        console.log("Post has been deleted");
        queryCache.refetchQueries("posts");
        return history.push("/");
      },
    }
  );

  return (
    <div className="flex flex-col container mx-auto mt-6 lg:mt-6 pt-64 sm:pt-32 bg-gray-300 overflow-hidden">
      {redirect && (
        <Redirect
          to={{
            pathname: "/signin",
            next: props.history.location.pathname,
          }}
        />
      )}

      {state.deleteForm && <DeleteModal id={id} />}

      {state.editForm && <EditModal id={id} post={data} />}

      {error &&
        error.response.data.errors.map((e, i) => <Errors key={i} error={e} />)}

      {status === "loading" && (
        <div className="sweet-loading max-w-xs mx-auto">
          <BeatLoader css={override} size={15} color="#38a169" />
        </div>
      )}

      {status === "success" && (
        <div className=" lg:bg-white p-8">
          <div className="flex flex-wrap flex-col lg:flex-row items-start  container mx-auto">
            <div>
              <div className="flex flex-wrap items-center bg-clip-text text-transparent bg-gradient-to-r from-teal-400  to-blue-700  font-black">
                <h2 className="font-semibold text-3xl  p-3">{data?.title}</h2>
                <p className="text-3xl">৳{data?.price}</p>
              </div>
              <div className="p-3 text-gray-700 lg:w-128 xl:mr-32">
                <Carousel width="" dynamicHeight>
                  {data?.book?.images.map((image, i) => (
                    <div className="lg:h-128">
                      <img src={image} alt={`${i}`} className="h-full" />
                    </div>
                  ))}
                </Carousel>
              </div>
            </div>
            {/* card */}
            <div className="lg:self-center ml-0 sm:ml-0 ">
              <div className="text-teal-800 self-center text-xl  w-72 pb-2 rounded shadow-lg overflow-hidden">
                <div className="flex bg-gradient-to-r from-teal-400 to-blue-500 items-center p-1 mb-6">
                  <p className="text-white">
                    {captitalize(data?.author?.name)}
                  </p>

                  <img
                    className="w-10 h-10 rounded-full ml-auto"
                    src={data?.author?.image || avatar}
                    alt="avatar"
                  />
                </div>
                <p className="p-1 mb-2">
                  Contact {getFirstName(data?.author?.name)}
                </p>
                <div className="flex items-center p-1">
                  <img src={CallIcon} alt="call" className="h-6 w-6" />
                  <p className="ml-2">
                    {reveal === true
                      ? data?.author?.phone
                      : data?.author?.slicedPhone}
                  </p>
                  <button
                    onClick={() => {
                      if (state.isAuthenticated) {
                        setReveal(true);
                      } else {
                        setRedirect(true);
                      }
                    }}
                    className="ml-auto border border-solid border-gray-500 p-1 hover:bg-blue-500
                hover:text-white"
                    type="submit"
                  >
                    Reveal
                  </button>
                </div>
              </div>

              {state.isAuthenticated && state.user._id === data?.author._id && (
                <div className="flex pt-12">
                  <button
                    type="button"
                    className="mr-auto focus:outline-none"
                    onClick={() => {
                      dispatch(ToggleEditForm());
                    }}
                  >
                    <Tippy content="Edit" placement="bottom">
                      <img
                        src={EditIcon}
                        className="w-10 h-10 cursor-pointer"
                        alt="icon"
                      />
                    </Tippy>
                  </button>

                  <button
                    type="button"
                    className="focus:outline-none"
                    onClick={() => {
                      dispatch(ToggleDeleteForm());
                      // deleteMutate();
                    }}
                  >
                    <Tippy content="Delete" placement="bottom">
                      <img
                        src={DeleteIcon}
                        className="w-10 h-10 cursor-pointer"
                        alt="icon"
                      />
                    </Tippy>
                  </button>
                </div>
              )}
              <div className="flex items-center border-t border-b  border-gray-500 border-solid p-3 mt-12 lg:mt-32">
                <p className="mr-auto text-xl  text-blue-500 font-semibold">
                  Share
                </p>
                <FacebookShareButton
                  url={url}
                  quote={data?.title}
                  className="mr-2 focus:outline-none"
                >
                  <FacebookIcon size={32} round />
                </FacebookShareButton>

                <TwitterShareButton
                  url={url}
                  title={data?.title}
                  className="mr-2 focus:outline-none"
                >
                  <TwitterIcon size={32} round />
                </TwitterShareButton>

                <LinkedinShareButton
                  url={url}
                  title={data?.title}
                  className="mr-2 focus:outline-none"
                >
                  <LinkedinIcon size={32} round />
                </LinkedinShareButton>

                <RedditShareButton
                  url={url}
                  title={data?.title}
                  windowWidth={660}
                  windowHeight={460}
                  className="focus:outline-none"
                >
                  <RedditIcon size={32} round />
                </RedditShareButton>
              </div>
            </div>
          </div>
          <div className="flex w-72 pb-1 lg:mx-4 mb-4 border-b border-gray-300 pt-6 lg:pt-0">
            <p className="mr-8 font-bold text-gray-700">posted</p>
            <p className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500  font-black">
              {moment(date).fromNow()}{" "}
            </p>
          </div>

          {/* {data?.writer && (
            <div className="flex">
              <p>Writeen By</p>
              <p>{data.writer}</p>
            </div>
          )} */}

          <div className="p-0 lg:p-3">
            <h3 className="font-bold text-xl text-gray-700 inline-block border-b border-gray-300 mb-3">
              Book Information
            </h3>
            <div className="flex items-center">
              <p className="mr-5 font-bold text-gray-700">name:</p>
              <p className="">{data?.book?.name}</p>
            </div>

            {data?.book?.writer && (
              <div className="flex items-center">
                <p className="mr-5 text-gray-700 font-bold">writer:</p>
                <p>{data?.book?.writer}</p>
              </div>
            )}
          </div>

          {data?.book?.summary && (
            <div className="lg:p-3 mt-4 lg:mt-0">
              <h3 className="font-bold text-xl text-gray-700 inline-block border-b border-gray-300 mb-3">
                summary
              </h3>
              <p>{data?.book?.summary}</p>
            </div>
          )}
          {data?.description && (
            <div className="lg:p-3 mt-4 lg:mt-0">
              <h3 className="font-bold text-xl text-gray-700 inline-block border-b border-gray-300 mb-3">
                Description
              </h3>
              <div className="">{data?.description}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SinglePost;
