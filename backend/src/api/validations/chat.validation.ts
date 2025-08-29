import Joi, { ValidationResult } from "joi";

/**
 * Types of inputs
 */
export interface GetChatsInput {
  tokenUserId: string;
}

export interface GetChatInput {
  id: string;          // chatId (MongoDB ObjectId in string)
  tokenUserId: string; // the logged-in user
}

export interface AddChatInput {
  receiverId: string;
}

export interface ReadChatInput {
  chatId: string;
}

/**
 * Joi diagrams
 */
const getChatsSchema = Joi.object<GetChatsInput>({
  tokenUserId: Joi.string().required().messages({
    "any.required": "User ID is required to fetch chats",
    "string.empty": "User ID cannot be empty",
  }),
});

const getChatSchema = Joi.object<GetChatInput>({
  id: Joi.string().required(),
  tokenUserId: Joi.string().required(),
});

const addChatSchema = Joi.object<AddChatInput>({
  receiverId: Joi.string().required().messages({
    "any.required": "Receiver ID is required.",
    "string.empty": "Receiver ID cannot be empty.",
  }),
});

const readChatSchema = Joi.object<ReadChatInput>({
  chatId: Joi.string().required().messages({
    "string.empty": "Chat ID is required",
  }),
});

/**
 * validation functions
 */
export const getChatsValidation = (
  data: unknown
): ValidationResult<GetChatsInput> => {
  return getChatsSchema.validate(data);
};

export const getChatValidation = (
  data: unknown
): ValidationResult<GetChatInput> => {
  return getChatSchema.validate(data);
};

export const addChatValidation = (
  data: unknown
): ValidationResult<AddChatInput> => {
  return addChatSchema.validate(data);
};

export const readChatValidation = (
  data: unknown
): ValidationResult<ReadChatInput> => {
  return readChatSchema.validate(data);
};
