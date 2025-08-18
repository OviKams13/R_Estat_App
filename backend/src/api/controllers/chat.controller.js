import prisma from "../../config/prismaConnexion.js";
import {
  getChatsValidation,
  getChatValidation,
  addChatValidation,
  readChatValidation,
} from "../validations/chat.validation.js";
import {
  getChatsService,
  getChatService,
  findExistingChat,
  createChat,
  readChatService,
} from "../services/chat.service.js";

export const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  // Validation
  const { error } = getChatsValidation({ tokenUserId });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const chats = await getChatsService(tokenUserId);
    res.status(200).json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get chats!" });
  }
};

export const getChat = async (req, res) => {
  const tokenUserId = req.userId;
  const { id } = req.params;

  // Validation
  const { error } = getChatValidation({ id, tokenUserId });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const chat = await getChatService(id, tokenUserId);
    res.status(200).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};

export const addChat = async (req, res) => {
  const tokenUserId = req.userId;
  const { receiverId } = req.body;

  // Validation
  const { error } = addChatValidation({ receiverId });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    // Check if a chat already exists
    const existingChat = await findExistingChat(tokenUserId, receiverId);
    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    // Create a new chat
    const newChat = await createChat(tokenUserId, receiverId);
    res.status(201).json(newChat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create or get chat!" });
  }
};

export const readChat = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.id;

  // Validation
  const { error } = readChatValidation({ chatId });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const chat = await readChatService(chatId, tokenUserId);
    res.status(200).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to read chat!" });
  }
};
