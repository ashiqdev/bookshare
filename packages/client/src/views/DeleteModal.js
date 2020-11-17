/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import Modal from "react-modal";
import axios from "axios";
import { useMutation, queryCache } from "react-query";
import {
  ToggleDeleteForm,
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

const FormModal = ({ id }) => {
  const history = useHistory();
  const { state, dispatch } = useContext(store);
  const [fileInputState, setFileInputState] = useState("");
  const [previewSource, setPreviewSource] = useState([]);

  const updatedUser = queryCache.getQueryData("user");

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

  console.log({ previewSource });

  //   if (isLoading) return <p>Loading...</p>;

  console.log({ updatedUser });

  const { API_URL } = process.env;

  const [deleteMutate, { status, error, data }] = useMutation(
    async () => {
      await axios.delete(`${API_URL}/api/posts/${id}`);
    },
    {
      onSuccess: () => {
        console.log("Post has been deleted");
        dispatch(ToggleDeleteForm());
        queryCache.refetchQueries("posts");
        return history.push("/");
      },
    }
  );

  return (
    <Modal
      isOpen={state.deleteForm}
      onRequestClose={() => dispatch(ToggleDeleteForm())}
      className="delete_Modal"
      overlayClassName="Overlay"
    >
      {/* <div className="flex">
        <button
          type="button"
          className="ml-auto absolute top-0 right-0 p-5 focus:outline-none"
          onClick={() => dispatch(ToggleDeleteForm())}
        >
          <img
            src={RemoveIcon}
            alt="Icon"
            className="focus:outline-none mr-2 sm:mr-0 lg:w-10 w-8 h-8 text-teal-500 hover: fill-current"
          />
        </button>
      </div> */}

      {error &&
        error.response.data.errors.map((e, i) => <Errors key={i} error={e} />)}

      {status === "loading" && (
        <div className="sweet-loading max-w-xs mx-auto">
          <BeatLoader css={override} size={15} color="#38a169" />
        </div>
      )}

      {/* {status === "success" && dispatch(ToggleModal())} */}
      <div className="w-72 pt-3">
        <h3 className="text-center font-bold text-lg">Delete Post?</h3>
        <p className="text-center text-gray-500  text-sm pt-3 leading-snug">
          This can't be undone and it will be removed from your profile, the
          timeline of any accounts that follow you and from Sharebook search
          result
        </p>
        <div className="flex justify-between pt-3 pb-2">
          <button
            type="button"
            onClick={() => dispatch(ToggleDeleteForm())}
            className="p-2 bg-gray-500 hover:bg-gray-700 text-white rounded"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              deleteMutate();
            }}
            className="p-2 bg-red-500 hover:bg-red-700 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default FormModal;
