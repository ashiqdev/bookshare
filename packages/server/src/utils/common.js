import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import { promisify } from "util";
import nodemailer from "nodemailer";
import { resetPasswordTemplate, verifyEmailTemplate } from "./Mail-Templates";

const { APP_SECRET } = process.env;

const signToken = ({ id, name, email }) => {
  return jwt.sign(
    {
      id,
      name,
      email,
    },
    APP_SECRET
  );
};

const createHash = async () => {
  const randomBytesPromise = promisify(randomBytes);
  const hash = (await randomBytesPromise(20)).toString("hex");
  return hash;
};

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,

  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export async function sendEmail({ email, token }, type) {
  switch (type) {
    case "verification":
      // Send email with verification url
      await transporter.sendMail({
        from: "any@any.com",
        to: email,
        subject: "Email verification",
        html: verifyEmailTemplate({ email, emailToken: token }),
      });
      break;

    case "reset":
      await transporter.sendMail({
        from: "ashikduit@gmail.com",
        to: email,
        subject: "Reset Password",
        html: resetPasswordTemplate(token),
      });
      break;

    default:
      break;
  }

  const urlType = type === "verification" ? "verification" : "reset";

  return { message: `${urlType} url sent to your mail` };
}

const replaceLastNChars = function (str, replace, num) {
  return str.slice(0, -num) + Array(num + 1).join(replace);
};

export { signToken, createHash, transporter, replaceLastNChars };
