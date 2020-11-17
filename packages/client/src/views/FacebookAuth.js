import React, { useContext } from "react";
import FacebookLogin from "react-facebook-login";
import axios from "axios";
import { LoginUser } from "src/context/action/actions";
import { store } from "src/context/store";

const FacebookAuth = () => {
  const { state, dispatch } = useContext(store);
  console.log({ fb: state });

  const responseSuccessFacebook = async (response) => {
    const res = await axios.post(
      "http://localhost:7777/api/users/facebooklogin",
      response
    );
    const { data: fbAuthData } = res;
    dispatch(LoginUser(fbAuthData));
  };
  return (
    <div>
      <FacebookLogin
        appId={process.env.FB_APP_ID}
        autoLoad={false}
        callback={responseSuccessFacebook}
        cssClass="mx-auto w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-blue-600 text-white flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow mb-5 hover:bg-blue-700"
      />
    </div>
  );
};

export default FacebookAuth;
