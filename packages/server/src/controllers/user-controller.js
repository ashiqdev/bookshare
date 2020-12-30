/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
import express from "express";
import { OAuth2Client } from "google-auth-library";
import fetch from "node-fetch";
import {
  loginUser,
  registerUser,
  verifyUser,
  getUser,
  resetPassword,
  socialSignIn,
  getCurrentUser,
  update,
} from "../services/user-service";
import { validate, validationRules } from "../utils/validator";
import { catchErrors } from "../helpers/error-catcher";
import { sendEmail } from "../utils/common";
import { BadRequest } from "../utils/errors";
import { checkAuth } from "../middlewares/auth";

const router = express.Router();

const registerHandler = async (req, res) => {
  const type = "verification";
  const { email, emailToken: token } = await registerUser(req.body);
  // send email
  const { message } = await sendEmail({ email, token }, type);

  return res.status(201).send({ message });
};

export const verifyUserHandler = async (req, res) => {
  const { user, token } = await verifyUser(req.body);
  return res.status(200).json({
    token,
    user,
  });
};

export const loginHandler = async (req, res) => {
  const { user, token } = await loginUser(req.body);
  return res.status(200).json({
    token,
    user,
  });
};

export const sendVerificationHandler = async (req, res) => {
  const type = "verification";
  const { email, token } = await getUser(req.body, type);
  // send email
  const { message } = await sendEmail({ email, token }, type);

  return res.status(200).send({ message });
};

export const requestResetHandler = async (req, res) => {
  const type = "reset";
  const { email, token } = await getUser(req.body, type);

  const { message } = await sendEmail({ email, token }, type);
  return res.status(200).send({ message });
};

export const resetPasswordHandler = async (req, res) => {
  const { message } = await resetPassword(req.body);
  return res.status(200).json({ message });
};

export const getUserHandler = async (req, res) => {
  const user = await getCurrentUser(req.user.id);
  return res.status(200).json({ user });
};

const googleLoginHandler = async (req, res) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT);
  const { tokenId } = req.body;
  const response = await client.verifyIdToken({
    idToken: tokenId,
    audience: process.env.GOOGLE_CLIENT,
  });

  const { name, email_verified, email } = response.payload;

  if (email_verified) {
    const { token, user } = await socialSignIn({ email, name });

    return res.status(200).json({
      token,
      user,
    });
  }
  throw new BadRequest("Google login failed. Try Again");
};

const facebookLoginHandler = async (req, res) => {
  const { userID, accessToken } = req.body;
  const url = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email&access_token=${accessToken}`;

  const originalResponse = await fetch(url, { method: "GET" });
  const response = await originalResponse.json();
  const { email, name } = response;
  const { token, user } = await socialSignIn({ email, name });

  return res.status(200).json({
    token,
    user,
  });
};

const completeProfileHandler = async (req, res) => {
  const { body } = req;
  // update the user
  const user = await update(body, req.params.id);
  return res.status(200).json({ user });
};

router.post(
  "/register",
  validationRules("register"),
  validate,
  catchErrors(registerHandler)
);

router.post("/verify", catchErrors(verifyUserHandler));

router.post(
  "/login",
  validationRules("login"),
  validate,
  catchErrors(loginHandler)
);

router.post(
  "/sendVerification",
  validationRules("email"),
  validate,
  catchErrors(sendVerificationHandler)
);

router.post(
  "/forget",
  validationRules("email"),
  validate,
  catchErrors(requestResetHandler)
);

router.post(
  "/reset",
  validationRules("reset"),
  validate,
  catchErrors(resetPasswordHandler)
);

router.get("/auth", checkAuth, catchErrors(getUserHandler));

// google and facebook auth
router.post("/googlelogin", catchErrors(googleLoginHandler));
router.post("/facebooklogin", catchErrors(facebookLoginHandler));

router.put(
  "/:id",
  checkAuth,
  validationRules("update_user"),
  validate,
  catchErrors(completeProfileHandler)
);

export default router;
