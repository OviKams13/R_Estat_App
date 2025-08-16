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