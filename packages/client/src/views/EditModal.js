/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import Modal from "react-modal";
import axios from "axios";
import { useMutation, queryCache } from "react-query";
import {
  ToggleEditForm,
  ToggleModal,
  ToggleSellForm,
} from "src/context/action/actions";
import { store } from "src/context/store";
import BeatLoader from "react-spinners/BeatLoader";
import { css } from "@emotion/core";
import UseForm from "../hooks/useForm";
import Errors from "./Errors";
import RemoveIcon from "../assets/icons/remove.svg";

const override = css`
  display: block;
  margin: 0 auto;
  text-align: center;
`;

const EditModal = ({ id, post }) => {
  console.log({ id, post });
  const history = useHistory();
  const { state, dispatch } = useContext(store);
  const [fileInputState, setFileInputState] = useState("");
  const [previewSource, setPreviewSource] = useState([...post.book.images]);

  const updatedUser = queryCache.getQueryData("user");

  const previewFile = (file) => {
    const reader = new FileReader();
    console.log({ test: reader.result });
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource([...previewSource, reader.result]);
    };
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    previewFile(file);
  };

  console.log({ previewSource });

  //   if (isLoading) return <p>Loading...</p>;

  console.log({ updatedUser });

  const { API_URL } = process.env;
  const [values, onChangeHandler, reset] = UseForm({
    name: post.book.name,
    writer: post.book.writer,
    title: post.title,
    price: post.price,
    summary: post.book.summary || "",
    description: post.description || "",
  });

  const [postMutate, { status, error, data }] = useMutation(
    async (value) => {
      // eslint-disable-next-line no-param-reassign

      // eslint-disable-next-line no-param-reassign
      value = { ...value, images: previewSource };

      await axios.put(`${API_URL}/api/posts/${id}`, value);
    },
    {
      onSuccess: () => {
        queryCache.refetchQueries(["post", id]);
        dispatch(ToggleEditForm());
        // go to homepage
        // return history.push("/");
      },
    }
  );

  const onSubmitHandler = (e) => {
    e.preventDefault();
    postMutate(values);
  };
  return (
    <Modal
      isOpen={state.editForm}
      onRequestClose={() => dispatch(ToggleEditForm())}
      className="Modal"
      overlayClassName="Overlay"
    >
      <div className="flex">
        <button
          type="button"
          className="ml-auto absolute top-0 right-0 p-5 focus:outline-none"
          onClick={() => dispatch(ToggleEditForm())}
        >
          <img
            src={RemoveIcon}
            alt="Icon"
            className="focus:outline-none mr-2 sm:mr-0 lg:w-10 w-8 h-8 text-teal-500 hover: fill-current"
          />
        </button>
      </div>

      {error &&
        error.response.data.errors.map((e, i) => <Errors key={i} error={e} />)}

      {status === "loading" && (
        <div className="sweet-loading max-w-xs mx-auto">
          <BeatLoader css={override} size={15} color="#38a169" />
        </div>
      )}

      {/* {status === "success" && dispatch(ToggleModal())} */}
      <form className="w-full max-w-lg" onSubmit={onSubmitHandler}>
        <div className="flex flex-wrap -mx-3 mb-2">
          {/* Book Name */}
          <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
            <label
              htmlFor="name"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            >
              Book Name
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="name"
              type="text"
              placeholder="The alchemist"
              name="name"
              value={values.name}
              onChange={onChangeHandler}
            />
          </div>

          {/* Book Writer */}
          <div className="w-full md:w-1/2 px-3">
            <label
              htmlFor="writer"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            >
              Book Writer
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="writer"
              type="text"
              placeholder="Asif Adnan"
              name="writer"
              value={values.writer}
              onChange={onChangeHandler}
            />
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-3">
          {/* Post  Title */}
          <div className="w-full md:w-1/2 px-3 mb-3">
            <label
              htmlFor="title"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            >
              Post Title
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="title"
              type="text"
              placeholder="I want to sell these books"
              name="title"
              value={values.title}
              onChange={onChangeHandler}
            />
          </div>

          {/* price */}
          <div className="w-full md:w-1/2 px-3 mb-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="price"
            >
              Price
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="price"
              type="text"
              placeholder="500"
              name="price"
              value={values.price}
              onChange={onChangeHandler}
            />
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-3">
          {/* Book Summary */}
          <div className="w-full md:w-1/2 px-3">
            <label
              htmlFor="summary"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            >
              Book Summary (Optional)
            </label>
            <textarea
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="title"
              type="text"
              placeholder="is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
              name="summary"
              value={values.summary || ""}
              onChange={onChangeHandler}
            />
          </div>

          {/* Post Description */}
          <div className="w-full md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="description"
            >
              Post Description (optional)
            </label>
            <textarea
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="description"
              type="text"
              placeholder="is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"
              name="description"
              value={values.description || ""}
              onChange={onChangeHandler}
            />
          </div>
        </div>

        {/* Photos */}

        <div className="flex flex-wrap -mx-3 mb-3">
          <div className="w-full md:w-full px-3 mb-3 md:mb-0 mt-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Book Images
            </label>
            <div className="mt-2 flex items-center">
              {/* <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                {previewSource ? (
                  <img
                    src={previewSource}
                    alt="Chosen"
                    className="h-full w-full text-gray-300"
                  />
                ) : updatedUser?.image ? (
                  <img
                    src={updatedUser.image}
                    alt="Chosen"
                    className="h-full w-full text-gray-300"
                  />
                ) : (
                  <svg
                    className="h-full w-full text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </span> */}
              {console.log(previewSource.length)}
              {previewSource.length > 0 &&
                previewSource.map((image) => (
                  <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100 mr-2">
                    <img
                      src={image}
                      alt=""
                      className="h-full w-full text-gray-300 inline-block"
                    />
                  </span>
                ))}
              <span className="ml-5 rounded-md shadow-sm">
                {/* <button
                  type="button"
                  className="py-2 px-3 border border-gray-300 rounded-md text-sm leading-4 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition duration-150 ease-in-out"
                >
                  Change
                </button> */}
                {/* <input type="file" name="image" /> */}
                <label htmlFor="file-input">
                  <img
                    className="w-10 h-10 cursor-pointer"
                    src="https://icon-library.net/images/upload-photo-icon/upload-photo-icon-21.jpg"
                    alt="ok"
                  />
                </label>
                <input
                  type="file"
                  id="file-input"
                  name="photo"
                  onChange={handleFileInputChange}
                  value={fileInputState}
                  className="w-3 hidden"
                />
              </span>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 mt-2">
          <button
            type="submit"
            className="w-full max-w-xs font-bold shadow-sm rounded py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow mt-5"
          >
            <span>Update</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditModal;
