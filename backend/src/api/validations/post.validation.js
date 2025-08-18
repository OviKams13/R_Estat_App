import Joi from "joi";

const getPostsSchema = Joi.object({
  city: Joi.string().allow("").optional(),
  type: Joi.string().valid("buy", "rent").allow("").optional(),
  property: Joi.string()
    .valid("apartment", "house", "condo", "land")
    .allow("")
    .optional(),
  bedroom: Joi.alternatives()
    .try(Joi.number().integer().min(0), Joi.string().valid(""))
    .optional(),
  minPrice: Joi.alternatives()
    .try(Joi.number().integer().min(0), Joi.string().valid(""))
    .optional(),
  maxPrice: Joi.alternatives()
    .try(Joi.number().integer().min(0), Joi.string().valid(""))
    .optional(),
});

export const getPostsValidation = (data) => {
  return getPostsSchema.validate(data);
};

const getPostSchema = Joi.object({
  id: Joi.string().required().length(24).messages({
    "string.base": "Post ID must be a string",
    "string.length": "Post ID must be a valid ObjectId (24 characters)",
    "any.required": "Post ID is required",
  }),
});

export const getPostValidation = (data) => {
  return getPostSchema.validate(data);
};

export const addPostValidation = (data) => {
  const schema = Joi.object({
    postData: Joi.object({
      title: Joi.string().min(3).required(),
      price: Joi.number().integer().positive().required(),
      images: Joi.array().items(Joi.string().uri()).optional(),
      address: Joi.string().required(),
      city: Joi.string().required(),
      bedroom: Joi.number().integer().min(0).required(),
      bathroom: Joi.number().integer().min(0).required(),
      latitude: Joi.string().optional(),
      longitude: Joi.string().optional(),
      type: Joi.string().valid("buy", "rent").required(),
      property: Joi.string()
        .valid("apartment", "house", "condo", "land")
        .required(),
    }).required(),

    postDetail: Joi.object({
      desc: Joi.string().required(),
      utilities: Joi.string().optional(),
      pet: Joi.string().optional(),
      income: Joi.string().optional(),
      size: Joi.number().integer().optional(),
      school: Joi.number().integer().optional(),
      bus: Joi.number().integer().optional(),
      restaurant: Joi.number().integer().optional(),
    }).required(),
  });

  return schema.validate(data);
};

export const deletePostValidation = (data) => {
  const schema = Joi.object({
    id: Joi.string().required().messages({
      "any.required": "Post ID is required",
      "string.empty": "Post ID cannot be empty",
    }),
  });

  return schema.validate(data);
};
