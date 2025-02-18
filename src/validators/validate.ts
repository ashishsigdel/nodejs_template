import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/apiError";

const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  // Optionally log or utilize extracted errors
  const extractedErrors = errors.array().map((err) => ({
    type: err.type,
    message: err.msg,
  }));

  // Throw the first error as ApiError
  throw new ApiError({
    status: 422,
    message: errors.array()[0].msg, // Send the first error's message
  });
};

export default validate;
