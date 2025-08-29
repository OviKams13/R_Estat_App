import Joi, { ValidationResult } from "joi";

/**
 * Input types for adding a message
 */
export interface MessageInput {
  chatId: string;
  text: string;
}

/**
 * Joi diagram
 * - chatId: required (generally coming from the params or the body according to your implementation)
 * - text: non-empty string
 */
const addMessageSchema = Joi.object<MessageInput>({
  chatId: Joi.string().required(),
  text: Joi.string().min(1).required(),
});

/**
 * Validation of adding a message
 * Use `unknown` as an input to force the validation
 */
export const addMessageValidation = (
  data: unknown
): ValidationResult<MessageInput> => {
  return addMessageSchema.validate(data);
};
