import Joi from "joi";

const getUsersSchema = Joi.object({});

export const getUsersValidation = (req) => {
  return getUsersSchema.validate(req.query);
};