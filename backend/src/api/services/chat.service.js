import prisma from "../../config/prismaConnexion.js";

export const getChatsService = async (tokenUserId) => {
  // Retrieve the chats of the connected user
  const chats = await prisma.chat.findMany({
    where: {
      userIDs: {
        hasSome: [tokenUserId],
      },
    },
  });

  // Add info on the receiver
  for (const chat of chats) {
    const receiverId = chat.userIDs.find((id) => id !== tokenUserId);

    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true, username: true, avatar: true },
    });

    chat.receiver = receiver;
  }

  return chats;
};

export const getChatService = async (id, tokenUserId) => {
  // Recovery of the chat with its messages
  const chat = await prisma.chat.findUnique({
    where: {
      id,
      userIDs: {
        hasSome: [tokenUserId],
      },
    },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  // Mark the chat as "seen" by the user
  await prisma.chat.update({
    where: { id },
    data: {
      seenBy: { push: [tokenUserId] },
    },
  });

  return chat;
};

export const findExistingChat = async (tokenUserId, receiverId) => {
  return await prisma.chat.findFirst({
    where: {
      userIDs: {
        hasEvery: [tokenUserId, receiverId],
      },
    },
  });
};

export const createChat = async (tokenUserId, receiverId) => {
  return await prisma.chat.create({
    data: {
      userIDs: [tokenUserId, receiverId],
    },
  });
};

export const readChatService = async (chatId, tokenUserId) => {
  return await prisma.chat.update({
    where: {
      id: chatId,
      userIDs: {
        hasSome: [tokenUserId],
      },
    },
    data: {
      seenBy: {
        set: [tokenUserId],
      },
    },
  });
};
