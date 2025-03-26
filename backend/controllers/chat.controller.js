import prisma from "../lib/prisma.js";

export const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
    });

    res.status(200).json(chats);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chats!" });
  }
};

export const getChat = async (req, res) => {
  
    res.status(200).json(chats);

    console.log(err);
    res.status(500).json({ message: "Failed to get chats!" });
};

export const addChat = async (req, res) => {
  
    res.status(200).json(chats);

    console.log(err);
    res.status(500).json({ message: "Failed to get chats!" });
};

export const readChat = async (req, res) => {
  
      res.status(200).json(chats);

      console.log(err);
      res.status(500).json({ message: "Failed to get chats!" });
};