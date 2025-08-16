import Joi from "joi";

const getPostsSchema = Joi.object({
  city: Joi.string().optional(),
  type: Joi.string().valid("buy", "rent").optional(),
  property: Joi.string().valid("apartment", "house", "condo", "land").optional(),
  bedroom: Joi.number().integer().min(0).optional(),
  minPrice: Joi.number().integer().min(0).optional(),
  maxPrice: Joi.number().integer().min(0).optional(),
});

export const getPostsValidation = (data) => {
  return getPostsSchema.validate(data);
};

const getPostSchema = Joi.object({
  id: Joi.string().required().length(24).messages({
    "string.base": "Post ID must be a string",
    "string.length": "Post ID must be a valid ObjectId (24 characters)",
    "any.required": "Post ID is required"
  }),
});

export const getPostValidation = (data) => {
  return getPostSchema.validate(data);
};