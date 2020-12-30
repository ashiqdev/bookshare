import { validationResult, check } from "express-validator";
import { BadRequest } from "./errors";

const validationRules = (type) => {
  switch (type) {
    case "register":
      return [
        // name must not be empty
        check("name", "name is required").trim().not().isEmpty(),
        check("email", "email is required").trim().isEmail(),
        check("password", "password must be 6 character long").isLength({
          min: 6,
        }),
      ];

    case "login":
      return [
        check("email", "email is not valid").trim().isEmail(),
        check("password", "password is required").trim().not().isEmpty(),
      ];

    case "email":
      return [check("email", "email is required").trim().isEmail()];

    case "update_user":
      return [
        check("address", "address should be a string")
          .trim()
          .optional()
          .isString(),
        check("phone", "phone should be a number").optional().isString(),
        check("linkedIn", "url should be a string").optional().isString(),
      ];

    case "reset":
      return [
        // password must be at least 6 chars long
        check("password", "password must be 6 character long").isLength({
          min: 6,
        }),
      ];

    case "create_post":
    case "update_post":
      return [
        // Book body
        check("name", "Book name is required").not().isEmpty(),

        // Post body
        check("title", "Title is required").not().isEmpty(),
        check("price", "price is required").not().isEmpty(),
      ];
    default:
      break;
  }
};

// actual validation

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  throw new BadRequest("", "", extractedErrors);
};

export { validationRules, validate };
