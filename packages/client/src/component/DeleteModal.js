/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import Modal from "react-modal";
import axios from "axios";
import { useMutation, queryCache } from "react-query";
import { ToggleDeleteForm } from "src/context/action/actions";
import { store } from "src/context/store";
import BeatLoader from "react-spinners/BeatLoader";
import { css } from "@emotion/core";
import Errors from "src/views/Errors";

const override = css`
  display: block;
  margin: 0 auto;
  text-align: center;
`;

const DeleteModal = ({ id }) => {
  const history = useHistory();
  const { state, dispatch } = useContext(store);

  const { API_URL } = process.env;

  const [deleteMutate, { status, error }] = useMutation(
    async () => {
      await axios.delete(`${API_URL}/api/posts/${id}`);
    },
    {
      onSuccess: () => {
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
      {error &&
        error.response.data.errors.map((e, i) => <Errors key={i} error={e} />)}

      {status === "loading" && (
        <div className="sweet-loading max-w-xs mx-auto">
          <BeatLoader css={override} size={15} color="#38a169" />
        </div>
      )}

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

export default DeleteModal;
