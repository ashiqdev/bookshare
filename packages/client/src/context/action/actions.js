import {
  LOGIN_SUCCESS,
  TOGGLE_BOX,
  CLOSE_BOX,
  OPEN_BOX,
  TOGGLE_MODAL,
  USER_LOADED,
  TOGGLE_SELL_FORM,
  TOGGLE_DELETE_FORM,
  TOGGLE_EDIT_FORM,
} from "./actionTypes";

export const LoginUser = (data) => {
  return {
    type: LOGIN_SUCCESS,
    payload: data,
  };
};

export const ToggleBox = () => {
  return {
    type: TOGGLE_BOX,
  };
};

export const CloseBox = () => {
  return {
    type: CLOSE_BOX,
  };
};

export const OpenBox = () => {
  return {
    type: OPEN_BOX,
  };
};

export const ToggleModal = () => {
  return {
    type: TOGGLE_MODAL,
  };
};

export const ToggleSellForm = () => {
  return {
    type: TOGGLE_SELL_FORM,
  };
};

export const ToggleDeleteForm = () => {
  return {
    type: TOGGLE_DELETE_FORM,
  };
};

export const ToggleEditForm = () => {
  return {
    type: TOGGLE_EDIT_FORM,
  };
};

export const LoadUser = () => {
  return {
    type: USER_LOADED,
  };
};
