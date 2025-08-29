import prisma from "../../config/prismaConnexion";
import { Message } from "@prisma/client";
import { MessageInput } from "../validations/message.validation";

export interface AddMessageArgs extends MessageInput {
  tokenUserId: string;
}

/**
 * Add a message in a chat if the user belongs to the chat.
 * Return the created Message.
 */
export const addMessageService = async ({
  chatId,
  text,
  tokenUserId,
}: AddMessageArgs): Promise<Message> => {
  // 1) Verify that the chat exists AND that the user is part of it
  // NOTE: `findUnique` only accepts unique criteria (ex: id).
  // To combine id + membership condition, we use `findFirst`.
  const chat = await prisma.chat.findFirst({
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

  // 2) create the message
  const message = await prisma.message.create({
    data: {
      text,
      chatId,
      userId: tokenUserId,
    },
  });

  // 3) Update the chat (mark seen by sender + lastMessage)
  // (Here we replace seenBy with [tokenUserId] as in the original code.
  // If you want to preserve the existing "views", we can adapt afterwards. )
  await prisma.chat.update({
    where: { id: chatId },
    data: {
      seenBy: [tokenUserId],
      lastMessage: text,
    },
  });

  return message;
};
