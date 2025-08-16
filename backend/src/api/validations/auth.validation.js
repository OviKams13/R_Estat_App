import Joi from "joi";

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const registerValidation = (data) => {
  return registerSchema.validate(data);
};

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

export const loginValidation = (data) => {
  return loginSchema.validate(data);
};