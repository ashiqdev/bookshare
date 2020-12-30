/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import Modal from "react-modal";
import axios from "axios";
import { useMutation, queryCache } from "react-query";
import { ToggleSellForm } from "src/context/action/actions";
import { store } from "src/context/store";
import BeatLoader from "react-spinners/BeatLoader";
import { css } from "@emotion/core";
import makeToast from "src/component/Toaster";
import Errors from "src/views/Errors";
import UseForm from "../hooks/useForm";
import RemoveIcon from "../assets/icons/remove.svg";

const override = css`
  display: block;
  margin: 0 auto;
  text-align: center;
`;

const FormModal = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(store);
  const [fileInputState, setFileInputState] = useState("");
  const [previewSource, setPreviewSource] = useState([]);

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource([...previewSource, reader.result]);
    };
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    previewFile(file);
  };

  const { API_URL } = process.env;
  const [values, onChangeHandler] = UseForm({
    name: "",
    writer: "",
    title: "",
    price: "",
    summary: "",
    description: "",
  });

  const [postMutate, { status, error }] = useMutation(
    async (value) => {
      // eslint-disable-next-line no-param-reassign
      if (previewSource.length > 0) value = { ...value, images: previewSource };
      await axios.post(`${API_URL}/api/posts/`, value);
    },
    {
      onSuccess: () => {
        queryCache.refetchQueries("posts");
        dispatch(ToggleSellForm());
        makeToast("success", "your ad has been submitted!");
        // go to homepage
        return history.push("/");
      },
    }
  );

  const onSubmitHandler = (e) => {
    e.preventDefault();
    postMutate(values);
  };
  return (
    <Modal
      isOpen={state.sellForm}
      onRequestClose={() => dispatch(ToggleSellForm())}
      className="Modal"
      overlayClassName="Overlay"
    >
      <div className="flex">
        <button
          type="button"
          className="ml-auto absolute top-0 right-0 p-16 sm:p-5 focus:outline-none"
          onClick={() => dispatch(ToggleSellForm())}
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

      <form className="w-full max-w-lg" onSubmit={onSubmitHandler}>
        <div className="flex flex-col sm:flex-row -mx-3 mb-2">
          {/* Book Name */}
          <div className="w-full md:w-1/2 px-3 mb-3 md:mb-0">
            <label
              htmlFor="name"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            >
              Book Name
            </label>
            <input
              className="appearance-none block  bg-gray-200 text-gray-700  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="name"
              type="text"
              placeholder="The alchemist"
              name="name"
              value={values.name || ""}
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
              className="appearance-none block bg-gray-200 text-gray-700  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="writer"
              type="text"
              placeholder="Asif Adnan"
              name="writer"
              value={values.writer || ""}
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
              value={values.title || ""}
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
              value={values.price || ""}
              onChange={onChangeHandler}
            />
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-3">
          {/* Book Summary */}
          <div className="hidden sm:block w-full md:w-1/2 px-3">
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
          <div className="hidden sm:block w-full md:w-1/2 px-3">
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
              {previewSource.length > 0 &&
                previewSource
                  .filter(
                    (i) => i !== "https://i.ibb.co/PY6PfWT/placeholder.jpg"
                  )
                  .map((image) => (
                    <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100 mr-2">
                      <img
                        src={image}
                        alt=""
                        className="h-full w-full text-gray-300 inline-block"
                      />
                    </span>
                  ))}
              <span className="ml-5 rounded-md shadow-sm">
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
            <span>Create</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FormModal;
