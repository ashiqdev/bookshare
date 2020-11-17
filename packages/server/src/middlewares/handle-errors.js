/* eslint-disable import/prefer-default-export */
import { GeneralError } from "../utils/errors";

export const handleErrors = async (err, req, res, next) => {
  let code = 500;
  if (err instanceof GeneralError) {
    code = err.getCode();
  }

  const correlationId = req.headers["x-correlation-id"];

  if (err.extractedErrors?.length > 0) {
    return res.status(code).json({
      correlationId,
      errors: err.extractedErrors,
    });
  }

  return res.status(code).json({
    correlationId,
    errors: [{ [err.type || "message"]: err.message }],
  });
};
