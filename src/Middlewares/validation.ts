import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import express from "express";

function validationMiddleware(
  type: any,
  skipMissingProperties = false
): express.RequestHandler {
  return async (req, res, next) => {
    const errors = await validate(plainToClass(type, req.body), {
      skipMissingProperties,
    });
    if (errors.length > 0) {
      const message = errors
        .map((error: ValidationError) => {
          return error.constraints
            ? Object.values(error.constraints)
            : "noting";
        })
        .join(", ");
      next(new Error(message));
    } else {
      next();
    }
  };
}

export default validationMiddleware;
