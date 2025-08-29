import prisma from "../../config/prismaConnexion";
import bcrypt from "bcrypt";
import { User, Post, SavedPost, Chat } from "@prisma/client";

/**
 * Generic type for service returns
 */
interface ServiceError {
  status: number;
  message: string;
}

export type ServiceResponse<T> =
  | { data: T }
  | { error: ServiceError }
  | { message: string };

/**
 * Services User
 */

export const getUsersService = async (): Promise<User[]> => {
  return await prisma.user.findMany();
};

export const getUserService = async (id: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

export const updateUserService = async (
  id: string,
  tokenUserId: string,
  password?: string,
  avatar?: string,
  inputs: Partial<User> = {}
): Promise<ServiceResponse<Omit<User, "password">>> => {
  if (id !== tokenUserId) {
    return { error: { status: 403, message: "Not Authorized!" } };
  }

  let updatedPassword: string | null = null;

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

  // We mask the password in the response
  const { password: userPassword, ...rest } = updatedUser;
  return { data: rest };
};

export const deleteUserService = async (
  id: string,
  tokenUserId: string
): Promise<ServiceResponse<{ message: string }>> => {
  if (id !== tokenUserId) {
    return { error: { status: 403, message: "Not Authorized!" } };
  }

  await prisma.user.delete({
    where: { id },
  });

  return { data: { message: "User deleted" } };
};

export const savePostService = async (
  tokenUserId: string,
  postId: string
): Promise<{ message: string }> => {
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

export const profilePostsService = async (
  userId: string
): Promise<{
  userPosts: Post[];
  savedPosts: Post[];
}> => {
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

export const getNotificationNumberService = async (
  userId: string
): Promise<number> => {
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
