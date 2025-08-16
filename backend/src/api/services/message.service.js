import prisma from "../../config/prismaConnexion.js";

export const addMessageService = async ({ chatId, text, tokenUserId }) => {
  // Verify that the chat exists and that the user belongs to it
  const chat = await prisma.chat.findUnique({
    where: {
      id: chatId,
      userIDs: {
        hasSome: [tokenUserId],
      },
    },
  });

  if (!chat) {
    throw new Error("Chat not found!");
  }

  // Create the message
  const message = await prisma.message.create({
    data: {
      text,
      chatId,
      userId: tokenUserId,
    },
  });

  // Update the chat
  await prisma.chat.update({
    where: { id: chatId },
    data: {
      seenBy: [tokenUserId],
      lastMessage: text,
    },
  });

  return message;
};
