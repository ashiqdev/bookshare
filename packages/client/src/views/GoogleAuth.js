/* eslint-disable react/prop-types */
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import GoogleLogin from "react-google-login";
import axios from "axios";
import { LoginUser } from "src/context/action/actions";
import { store } from "src/context/store";

const GoogleAuth = ({ path }) => {
  const history = useHistory();
  const { state, dispatch } = useContext(store);
  console.log({ path });
  // google-auth success and failure methods
  let res;
  const responseSuccessGoogle = async (response) => {
    res = await axios.post("http://localhost:7777/api/users/googlelogin", {
      tokenId: response.tokenId,
    });
    const { data: googleAuthData } = res;
    console.log({ googleAuthData });
    dispatch(LoginUser(googleAuthData));
    // TODO redirect to home page
    if (path) {
      // console.log(");
      return history.push(path);
    }
  };

  const responseFailureGoogle = (response) => {
    console.log({ response });
  };

  return (
    <GoogleLogin
      clientId={process.env.GOOGLE_CLIENT}
      render={(renderProps) => (
        <button
          className="mx-auto w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-red-600 text-white flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow mb-5 hover:bg-red-700"
          type="submit"
          onClick={renderProps.onClick}
          disabled={renderProps.disabled}
        >
          Login With Google
        </button>
      )}
      buttonText="Sign In with Google"
      onSuccess={responseSuccessGoogle}
      onFailure={responseFailureGoogle}
      // eslint-disable-next-line react/jsx-curly-brace-presence
      cookiePolicy={"single_host_origin"}
    />
  );
};

export default GoogleAuth;
