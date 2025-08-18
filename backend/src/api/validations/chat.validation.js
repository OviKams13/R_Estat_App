import Joi from "joi";

export const getChatsValidation = (data) => {
  const schema = Joi.object({
    tokenUserId: Joi.string().required().messages({
      "any.required": "User ID is required to fetch chats",
      "string.empty": "User ID cannot be empty",
    }),
  });

  return schema.validate(data);
};

export const getChatValidation = (data) => {
  const schema = Joi.object({
    id: Joi.string().required(), // the cat ID (Mongo ObjectId in string)
    tokenUserId: Joi.string().required(), // the ID of the logged-in user
  });

  return schema.validate(data);
};

export const addChatValidation = (data) => {
  const schema = Joi.object({
    receiverId: Joi.string().required().messages({
      "any.required": "Receiver ID is required.",
      "string.empty": "Receiver ID cannot be empty.",
    }),
  });

  return schema.validate(data);
};

export const readChatValidation = (data) => {
  const schema = Joi.object({
    chatId: Joi.string().required().messages({
      "string.empty": "Chat ID is required",
    }),
  });
  return schema.validate(data);
};
