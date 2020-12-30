/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext, useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import { useMutation, queryCache } from "react-query";
import { ToggleModal } from "src/context/action/actions";
import { store } from "src/context/store";
import BeatLoader from "react-spinners/BeatLoader";
import { css } from "@emotion/core";
import Errors from "src/views/Errors";
import UseForm from "../hooks/useForm";
import RemoveIcon from "../assets/icons/remove.svg";

const override = css`
  display: block;
  margin: 0 auto;
  text-align: center;
`;

const ProfileModal = () => {
  const { state, dispatch } = useContext(store);

  const [fileInputState, setFileInputState] = useState("");
  const [previewSource, setPreviewSource] = useState("");

  const updatedUser = queryCache.getQueryData("user");

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    previewFile(file);
  };

  const { API_URL } = process.env;
  const [values, onChangeHandler] = UseForm({
    address: updatedUser ? updatedUser.address : "",
    phone: updatedUser ? updatedUser.phone : "",
    gender: updatedUser?.gender ? updatedUser.gender : "male",
    linkedIn: updatedUser ? updatedUser.linkedIn : "",
  });

  const [profileMutate, { status, error }] = useMutation(
    async (value) => {
      // eslint-disable-next-line no-param-reassign
      if (previewSource) value = { ...value, image: previewSource };
      await axios.put(`${API_URL}/api/users/${state?.user?._id}`, value);
    },
    {
      onSuccess: () => {
        queryCache.refetchQueries("user");
        queryCache.refetchQueries("post");

        dispatch(ToggleModal());
      },
    }
  );

  const onSubmitHandler = (e) => {
    e.preventDefault();
    profileMutate(values);
  };

  return (
    <Modal
      isOpen={state.modal}
      onRequestClose={() => dispatch(ToggleModal())}
      className="Modal"
      overlayClassName="Overlay"
    >
      <div className="flex">
        <button
          type="button"
          className="ml-auto absolute top-0 right-0  p-16 sm:p-5  focus:outline-none"
          onClick={() => dispatch(ToggleModal())}
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

      {state.warning && (
        <p
          className="mx-auto bg-red-100 border border-red-400 text-red-700 px-2 py-2 rounded relative mb-3 text-xs"
          role="alert"
        >
          {state.warning}
        </p>
      )}

      <form className="w-64 sm:w-full sm:max-w-lg" onSubmit={onSubmitHandler}>
        <div className="flex flex-col sm:flex-row sm:flex-wrap -mx-3 mb-6">
          {/* address */}
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              htmlFor="address"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            >
              Address
            </label>
            <input
              className="block w-full bg-gray-200 text-gray-700  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              id="address"
              type="text"
              placeholder="Boston Ma"
              name="address"
              value={values.address || ""}
              onChange={onChangeHandler}
            />
          </div>

          {/* Phone */}
          <div className="w-full md:w-1/2 px-3">
            <label
              htmlFor="phone"
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            >
              Phone
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="phone"
              type="text"
              placeholder="+8801521206149"
              name="phone"
              value={values.phone || ""}
              onChange={onChangeHandler}
            />
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-6">
          {/* Gender */}
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="gender"
            >
              Gender
            </label>
            <div className="relative">
              <select
                name="gender"
                value={values.gender || "male"}
                onChange={onChangeHandler}
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="gender"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Others</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* linked In */}
          <div className="w-full md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="linkedIn"
            >
              LinkedIn (optional)
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="linkedIn"
              type="text"
              placeholder="https://www.linkedin.com/in/jisan-mia/"
              name="linkedIn"
              value={values.linkedIn || ""}
              onChange={onChangeHandler}
            />
          </div>
        </div>

        {/* Photo */}

        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0 mt-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
              Photo
            </label>
            <div className="mt-2 flex flex-col sm:flex-row sm:items-center">
              <span className="block sm:inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
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
              </span>
              <span className="ml-5 mt-4 rounded-md shadow-sm">
                <input
                  type="file"
                  name="photo"
                  onChange={handleFileInputChange}
                  value={fileInputState}
                  className="w-3 -ml-12 sm:ml-0"
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

export default ProfileModal;
