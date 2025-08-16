import { addMessageValidation } from "../validations/message.validation.js";
import { addMessageService } from "../services/message.service.js";

export const addMessage = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.chatId;
  const { text } = req.body;

  // Validation
  const { error } = addMessageValidation({ chatId, text });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const message = await addMessageService({ chatId, text, tokenUserId });
    res.status(200).json(message);
  } catch (err) {
    console.error(err);
    res
      .status(err.message === "Chat not found!" ? 404 : 500)
      .json({ message: err.message || "Failed to add message!" });
  }
};
