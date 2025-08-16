import prisma from "../../config/prismaConnexion.js";
import bcrypt from "bcrypt";

export const getUsersService = async () => {
  return await prisma.user.findMany();
};

export const getUserService = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

export const updateUserService = async (
  id,
  tokenUserId,
  password,
  avatar,
  inputs
) => {
  if (id !== tokenUserId) {
    return { error: { status: 403, message: "Not Authorized!" } };
  }

  let updatedPassword = null;

  if (password) {
    updatedPassword = await bcrypt.hash(password, 10);
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      ...inputs,
      ...(updatedPassword && { password: updatedPassword }),
      ...(avatar && { avatar }),
    },
  });

  const { password: userPassword, ...rest } = updatedUser;
  return { data: rest };
};

export const deleteUserService = async (id, tokenUserId) => {
  if (id !== tokenUserId) {
    return { error: { status: 403, message: "Not Authorized!" } };
  }

  await prisma.user.delete({
    where: { id },
  });

  return { data: { message: "User deleted" } };
};

export const savePostService = async (tokenUserId, postId) => {
  const savedPost = await prisma.savedPost.findUnique({
    where: {
      userId_postId: {
        userId: tokenUserId,
        postId,
      },
    },
  });

  if (savedPost) {
    await prisma.savedPost.delete({
      where: {
        id: savedPost.id,
      },
    });
    return { message: "Post removed from saved list" };
  } else {
    await prisma.savedPost.create({
      data: {
        userId: tokenUserId,
        postId,
      },
    });
    return { message: "Post saved" };
  }
};

export const profilePostsService = async (userId) => {
  const userPosts = await prisma.post.findMany({
    where: { userId },
  });

  const saved = await prisma.savedPost.findMany({
    where: { userId },
    include: {
      post: true,
    },
  });

  const savedPosts = saved.map((item) => item.post);

  return { userPosts, savedPosts };
};

export const getNotificationNumberService = async (userId) => {
  const number = await prisma.chat.count({
    where: {
      userIDs: {
        hasSome: [userId],
      },
      NOT: {
        seenBy: {
          hasSome: [userId],
        },
      },
    },
  });

  return number;
};