import prisma from "../../config/prismaConnexion";
import { Chat, Message, User } from "@prisma/client";

/** Tenriched output tools */
export type ChatWithReceiver = Chat & {
  receiver: Pick<User, "id" | "username" | "avatar"> | null;
};

export type ChatWithMessages = Chat & {
  messages: Message[];
};

/**
 * Retrieve the user’s chats and add the "receiver" (the other participant)
 */
export const getChatsService = async (
  tokenUserId: string
): Promise<ChatWithReceiver[]> => {
  const chats = await prisma.chat.findMany({
    where: {
      userIDs: { hasSome: [tokenUserId] },
    },
    orderBy: { createdAt: "desc" },
  });

  // Enrich each chat with the 'receiver'
  const withReceiver: ChatWithReceiver[] = [];
  for (const chat of chats) {
    const receiverId = chat.userIDs.find((id) => id !== tokenUserId) || null;

    let receiver: Pick<User, "id" | "username" | "avatar"> | null = null;
    if (receiverId) {
      receiver = await prisma.user.findUnique({
        where: { id: receiverId },
        select: { id: true, username: true, avatar: true },
      });
    }

    withReceiver.push({ ...chat, receiver });
  }

  return withReceiver;
};

/**
 * Retrieve a chat (if the user belongs to it) + messages (sorted asc),
 * then marks the chat as "seen" by the user.
 */
export const getChatService = async (
  id: string,
  tokenUserId: string
): Promise<ChatWithMessages | null> => {
  // `findUnique` accepts only unique keys -> check membership with `findFirst`
  const chat = await prisma.chat.findFirst({
    where: {
      id,
      userIDs: { hasSome: [tokenUserId] },
    },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!chat) return null;

  // Unduplicate seenBy by adding the current user to it
  const newSeenBy = Array.from(new Set([...(chat.seenBy || []), tokenUserId]));

  await prisma.chat.update({
    where: { id: chat.id }, // unique
    data: { seenBy: { set: newSeenBy } },
  });

  return chat;
};

/**
 * Find an existing chat between two users (no matter the order)
 */
export const findExistingChat = async (
  tokenUserId: string,
  receiverId: string
): Promise<Chat | null> => {
  return prisma.chat.findFirst({
    where: {
      userIDs: { hasEvery: [tokenUserId, receiverId] },
    },
  });
};

/**
 * Create a chat between two users
 */
export const createChat = async (
  tokenUserId: string,
  receiverId: string
): Promise<Chat> => {
  return prisma.chat.create({
    data: {
      userIDs: [tokenUserId, receiverId],
      seenBy: [], // default
    },
  });
};

/**
 * Mark a chat as read by the user (resets to {tokenUserId})
 */
export const readChatService = async (
  chatId: string,
  tokenUserId: string
): Promise<Chat | null> => {
  // Verify membership via findFirst
  const chat = await prisma.chat.findFirst({
    where: {
      id: chatId,
      userIDs: { hasSome: [tokenUserId] },
    },
  });
  if (!chat) return null;

  return prisma.chat.update({
    where: { id: chat.id },
    data: { seenBy: { set: [tokenUserId] } },
  });
};
