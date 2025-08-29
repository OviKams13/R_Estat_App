import Joi, { ValidationResult } from "joi";

/**
 * input types
 */
export interface AuthRegisterInput {
  username: string;
  email: string;
  password: string;
}

export interface AuthLoginInput {
  username: string;
  password: string;
}

/**
 * Joi diagrams
 */
const registerSchema = Joi.object<AuthRegisterInput>({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object<AuthLoginInput>({
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

/**
 * Validation functions (typed returns)
 */
export const registerValidation = (
  data: unknown
): ValidationResult<AuthRegisterInput> => {
  return registerSchema.validate(data);
};

export const loginValidation = (
  data: unknown
): ValidationResult<AuthLoginInput> => {
  return loginSchema.validate(data);
};
