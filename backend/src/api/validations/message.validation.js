import Joi from "joi";

const addMessageSchema = Joi.object({
  chatId: Joi.string().required(), // chatId coming from params
  text: Joi.string().min(1).required(), // the text must not be empty
});

export const addMessageValidation = (data) => {
  return addMessageSchema.validate(data);
};