import Joi from "joi";

const getUsersSchema = Joi.object({});

export const getUsersValidation = (req) => {
  return getUsersSchema.validate(req.query);
};

// Definition of the schema to validate the ID passed as a parameter
const getUserSchema = Joi.object({
  id: Joi.string().required().length(24), // 24 characters for a MongoDB ObjectId
});

export const getUserValidation = (req) => {
  return getUserSchema.validate(req.params);
};

// Diagram to validate the update of a user
const updateUserSchema = Joi.object({
  id: Joi.string().required().length(24), // Verification of the ObjectId
  password: Joi.string().min(6).optional(),
  avatar: Joi.string().uri().optional(),
}).unknown(true); // unknown(true) allows to keep the other fields as "inputs

export const updateUserValidation = (req) => {
  // We validate both params and body
  const paramsValidation = Joi.object({
    id: Joi.string().required().length(24),
  }).validate(req.params);

  if (paramsValidation.error) {
    return paramsValidation;
  }

  return updateUserSchema.validate({ ...req.params, ...req.body });
};

const deleteUserSchema = Joi.object({
  id: Joi.string().required().length(24),
});

export const deleteUserValidation = (req) => {
  return deleteUserSchema.validate(req.params);
};

const savePostSchema = Joi.object({
  postId: Joi.string().required().length(24),
});

export const savePostValidation = (req) => {
  return savePostSchema.validate(req.body);
};

const profilePostsSchema = Joi.object({
  userId: Joi.string().required().length(24),
});

export const profilePostsValidation = (req) => {
  return profilePostsSchema.validate({ userId: req.userId });
};

const getNotificationNumberSchema = Joi.object({
  userId: Joi.string().required().length(24),
});

export const getNotificationNumberValidation = (req) => {
  return getNotificationNumberSchema.validate({ userId: req.userId });
};