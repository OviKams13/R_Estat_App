import Joi, { ValidationResult } from "joi";
import { Request } from "express";

/**
 * Types derived from validation schemes
 */
export interface GetUserParams {
  id: string;
}

export interface UpdateUserInput {
  id: string;
  password?: string;
  avatar?: string;
  [key: string]: any; // to manage unknown(true)
}

export interface SavePostInput {
  postId: string;
}

export interface ProfilePostsInput {
  userId: string;
}

export interface GetNotificationNumberInput {
  userId: string;
}

/**
 * Joi diagrams
 */
const getUsersSchema = Joi.object({});

const getUserSchema = Joi.object<GetUserParams>({
  id: Joi.string().required().length(24),
});

const updateUserSchema = Joi.object<UpdateUserInput>({
  id: Joi.string().required().length(24),
  password: Joi.string().min(6).optional(),
  avatar: Joi.string().uri().optional(),
}).unknown(true);

const deleteUserSchema = Joi.object<GetUserParams>({
  id: Joi.string().required().length(24),
});

const savePostSchema = Joi.object<SavePostInput>({
  postId: Joi.string().required().length(24),
});

const profilePostsSchema = Joi.object<ProfilePostsInput>({
  userId: Joi.string().required().length(24),
});

const getNotificationNumberSchema = Joi.object<GetNotificationNumberInput>({
  userId: Joi.string().required().length(24),
});

/**
 * validation functions
 */
export const getUsersValidation = (
  req: Request
): ValidationResult<Record<string, never>> => {
  return getUsersSchema.validate(req.query);
};

export const getUserValidation = (
  req: Request<GetUserParams>
): ValidationResult<GetUserParams> => {
  return getUserSchema.validate(req.params);
};

export const updateUserValidation = (
  req: Request<GetUserParams, any, Partial<UpdateUserInput>>
): ValidationResult<UpdateUserInput> => {
  const paramsValidation = Joi.object<GetUserParams>({
    id: Joi.string().required().length(24),
  }).validate(req.params);

  if (paramsValidation.error) {
    return paramsValidation;
  }

  return updateUserSchema.validate({ ...req.params, ...req.body });
};

export const deleteUserValidation = (
  req: Request<GetUserParams>
): ValidationResult<GetUserParams> => {
  return deleteUserSchema.validate(req.params);
};

export const savePostValidation = (
  req: Request<any, any, SavePostInput>
): ValidationResult<SavePostInput> => {
  return savePostSchema.validate(req.body);
};

export const profilePostsValidation = (
  req: Request
): ValidationResult<ProfilePostsInput> => {
  return profilePostsSchema.validate({ userId: (req as any).userId });
};

export const getNotificationNumberValidation = (
  req: Request
): ValidationResult<GetNotificationNumberInput> => {
  return getNotificationNumberSchema.validate({ userId: (req as any).userId });
};
