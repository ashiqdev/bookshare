import {
  AUTH_ERROR,
  CLOSE_BOX,
  LOGIN_SUCCESS,
  LOG_OUT,
  OPEN_BOX,
  TOGGLE_BOX,
  TOGGLE_MODAL,
  USER_LOADED,
  TOGGLE_SELL_FORM,
  TOGGLE_DELETE_FORM,
  TOGGLE_EDIT_FORM,
} from "./action/actionTypes";

const reducer = (state, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      return { ...state, ...action.payload, isAuthenticated: true, box: false };
    case USER_LOADED:
      return { ...state, isAuthenticated: true, user: action.payload };
    case AUTH_ERROR:
    case LOG_OUT:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
      };
    case TOGGLE_BOX:
      return {
        ...state,
        box: !state.box,
      };

    case CLOSE_BOX:
      return {
        ...state,
        box: false,
      };

    case OPEN_BOX:
      return {
        ...state,
        box: true,
      };

    case TOGGLE_MODAL:
      if (action.payload) {
        return {
          ...state,
          box: false,
          modal: !state.modal,
          warning: action.payload,
        };
      }
      return {
        ...state,
        box: false,
        modal: !state.modal,
        warning: null,
      };

    case TOGGLE_SELL_FORM:
      return {
        ...state,
        sellForm: !state.sellForm,
        warning: null,
        modal: false,
      };

    case TOGGLE_DELETE_FORM:
      return {
        ...state,
        deleteForm: !state.deleteForm,
        warning: null,
      };

    case TOGGLE_EDIT_FORM:
      return {
        ...state,
        editForm: !state.editForm,
        warning: null,
      };

    default:
      return state;
  }
};

export default reducer;
