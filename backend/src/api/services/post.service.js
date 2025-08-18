import prisma from "../../config/prismaConnexion.js";
import jwt from "jsonwebtoken";

export const getPostsService = async (filters) => {
  const { city, type, property, bedroom, minPrice, maxPrice } = filters;

  const posts = await prisma.post.findMany({
    where: {
      city: city || undefined,
      type: type || undefined,
      property: property || undefined,
      bedroom: bedroom ? parseInt(bedroom) : undefined,
      price: {
        gte: minPrice ? parseInt(minPrice) : undefined,
        lte: maxPrice ? parseInt(maxPrice) : undefined,
      },
    },
  });

  return posts;
};

export const getPostService = async (id, token) => {
  // Retrieve the post + details + user info
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      postDetail: true,
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });

  // Decode the user ID from the token
  let userId = null;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, payload) => {
      if (!err) {
        userId = payload.id;
      }
    });
  }

  // Check if the post is saved by this user
  let saved = null;
  if (userId) {
    saved = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          postId: id,
          userId,
        },
      },
    });
  }

  return { ...post, isSaved: !!saved };
};

export const addPostService = async (userId, postData, postDetail) => {
  // All the logic for creating the post is centralized
  return await prisma.post.create({
    data: {
      ...postData,
      userId,
      postDetail: {
        create: postDetail,
      },
    },
  });
};

export const deletePostService = async (id, tokenUserId) => {
  // Check if the post exists
  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  // Check if the connected user is indeed the owner
  if (post.userId !== tokenUserId) {
    throw new Error("Not Authorized");
  }

  // delete post
  await prisma.post.delete({
    where: { id },
  });

  return { message: "Post deleted" };
};
