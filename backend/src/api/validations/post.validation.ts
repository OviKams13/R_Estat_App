import Joi, { ValidationResult } from "joi";

/**
 * Enumerations aligned on schema.prisma
 */
export type PostType = "buy" | "rent";
export type PropertyType = "apartment" | "house" | "condo" | "land";

/**
 * Types of inputs
 */
export interface GetPostsQuery {
  city?: string | "";
  type?: PostType | "";
  property?: PropertyType | "";
  bedroom?: number | "";
  minPrice?: number | "";
  maxPrice?: number | "";
}

export interface GetPostParams {
  id: string; // MongoDB ObjectId (24 chars)
}

export interface AddPostInput {
  postData: {
    title: string;
    price: number;
    images?: string[];
    address: string;
    city: string;
    bedroom: number;
    bathroom: number;
    latitude?: string;
    longitude?: string;
    type: PostType;
    property: PropertyType;
  };
  postDetail: {
    desc: string;
    utilities?: string;
    pet?: string;
    income?: string;
    size?: number;
    school?: number;
    bus?: number;
    restaurant?: number;
  };
}

export interface DeletePostInput {
  id: string;
}

/**
 * Joi diagrams
 */
const getPostsSchema = Joi.object<GetPostsQuery>({
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

const getPostSchema = Joi.object<GetPostParams>({
  id: Joi.string().required().length(24).messages({
    "string.base": "Post ID must be a string",
    "string.length": "Post ID must be a valid ObjectId (24 characters)",
    "any.required": "Post ID is required",
  }),
});

const addPostSchema = Joi.object<AddPostInput>({
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

const deletePostSchema = Joi.object<DeletePostInput>({
  id: Joi.string().required().messages({
    "any.required": "Post ID is required",
    "string.empty": "Post ID cannot be empty",
  }),
});

/**
 * Validation functions (entries in `unknown`, typed returns)
 */
export const getPostsValidation = (
  data: unknown
): ValidationResult<GetPostsQuery> => {
  return getPostsSchema.validate(data);
};

export const getPostValidation = (
  data: unknown
): ValidationResult<GetPostParams> => {
  return getPostSchema.validate(data);
};

export const addPostValidation = (
  data: unknown
): ValidationResult<AddPostInput> => {
  return addPostSchema.validate(data);
};

export const deletePostValidation = (
  data: unknown
): ValidationResult<DeletePostInput> => {
  return deletePostSchema.validate(data);
};
