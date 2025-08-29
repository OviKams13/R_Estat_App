import { Request, Response } from "express";
import {
  getChatsValidation,
  getChatValidation,
  addChatValidation,
  readChatValidation,
} from "../validations/chat.validation";
import {
  getChatsService,
  getChatService,
  findExistingChat,
  createChat,
  readChatService,
} from "../services/chat.service";

// Extends the request to have req.userId (filled in by verifyToken)
interface RequestWithUser<P = any, ResBody = any, ReqBody = any, ReqQuery = any>
  extends Request<P, ResBody, ReqBody, ReqQuery> {
  userId?: string;
}

/**
 * GET /api/chats
 */
export const getChats = async (
  req: RequestWithUser,
  res: Response
): Promise<void> => {
  const tokenUserId = req.userId;

  const { error } = getChatsValidation({ tokenUserId: tokenUserId ?? "" });
  if (error) {
    const message =
      error.details?.[0]?.message ?? error.message ?? "Invalid input";
    res.status(400).json({ message });
    return;
  }

  try {
    const chats = await getChatsService(tokenUserId!);
    res.status(200).json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get chats!" });
  }
};

/**
 * GET /api/chats/:id
 */
export const getChat = async (
  req: RequestWithUser<{ id: string }>,
  res: Response
): Promise<void> => {
  const tokenUserId = req.userId;
  const { id } = req.params;

  const { error } = getChatValidation({ id, tokenUserId: tokenUserId ?? "" });
  if (error) {
    const message =
      error.details?.[0]?.message ?? error.message ?? "Invalid input";
    res.status(400).json({ message });
    return;
  }

  try {
    const chat = await getChatService(id, tokenUserId!);
    if (!chat) {
      res.status(404).json({ message: "Chat not found!" });
      return;
    }
    res.status(200).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};

/**
 * POST /api/chats
 */
export const addChat = async (
  req: RequestWithUser<unknown, unknown, { receiverId: string }>,
  res: Response
): Promise<void> => {
  const tokenUserId = req.userId;
  const { receiverId } = req.body;

  const { error } = addChatValidation({ receiverId });
  if (error) {
    const message =
      error.details?.[0]?.message ?? error.message ?? "Invalid input";
    res.status(400).json({ message });
    return;
  }

  try {
    const existingChat = await findExistingChat(tokenUserId!, receiverId);
    if (existingChat) {
      res.status(200).json(existingChat);
      return;
    }

    const newChat = await createChat(tokenUserId!, receiverId);
    res.status(201).json(newChat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create or get chat!" });
  }
};

/**
 * PUT /api/chats/read/:id
 */
export const readChat = async (
  req: RequestWithUser<{ id: string }>,
  res: Response
): Promise<void> => {
  const tokenUserId = req.userId;
  const chatId = req.params.id;

  const { error } = readChatValidation({ chatId });
  if (error) {
    const message =
      error.details?.[0]?.message ?? error.message ?? "Invalid input";
    res.status(400).json({ message });
    return;
  }

  try {
    const chat = await readChatService(chatId, tokenUserId!);
    if (!chat) {
      res.status(404).json({ message: "Chat not found!" });
      return;
    }
    res.status(200).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to read chat!" });
  }
};
