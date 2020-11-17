const { CLIENT_URL } = process.env;

const verifyEmailTemplate = ({ email, emailToken }) => `
  <div className="email" style="
    border: 1px solid black;
    padding: 20px;
    font-family: sans-serif;
    line-height: 2;
    font-size: 20px;
  ">
    <h2>Hello There!</h2>
    <p>Your email verification Token is here!
    \n\n
    <a href="${CLIENT_URL}/verify?token=${emailToken}&email=${email}">Click Here to verify</a></p>
  `;

const resetPasswordTemplate = (token) => `
  <div className="email" style="
    border: 1px solid black;
    padding: 20px;
    font-family: sans-serif;
    line-height: 2;
    font-size: 20px;
  ">
    <h2>Hello There!</h2>
    <p>Your Password Reset Token is here!
    \n\n
    <a href="${CLIENT_URL}/reset?resetToken=${token}">Click Here to Reset</a></p>
  `;

module.exports = { verifyEmailTemplate, resetPasswordTemplate };
