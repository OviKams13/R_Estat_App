import prisma from "../../config/prismaConnexion";
import jwt from "jsonwebtoken";
import { Post, PostDetail, Prisma } from "@prisma/client";
import {
  GetPostsQuery,
  AddPostInput,
} from "../validations/post.validation";

/**
 * GET /posts - list with filters
 */
export const getPostsService = async (filters: GetPostsQuery): Promise<Post[]> => {
  const { city, type, property, bedroom, minPrice, maxPrice } = filters;

  const parsedBedroom =
    typeof bedroom === "number"
      ? bedroom
      : bedroom === "" || bedroom === undefined
      ? undefined
      : Number.parseInt(String(bedroom), 10);

  const parsedMin =
    typeof minPrice === "number"
      ? minPrice
      : minPrice === "" || minPrice === undefined
      ? undefined
      : Number.parseInt(String(minPrice), 10);

  const parsedMax =
    typeof maxPrice === "number"
      ? maxPrice
      : maxPrice === "" || maxPrice === undefined
      ? undefined
      : Number.parseInt(String(maxPrice), 10);

  // NEVER PUT undefined: we only include the key if it exists
  const where: Prisma.PostWhereInput = {
    ...(city ? { city } : {}),
    ...(type ? { type: type as Post["type"] } : {}),
    ...(property ? { property: property as Post["property"] } : {}),
    ...(parsedBedroom !== undefined ? { bedroom: parsedBedroom } : {}),
    ...((parsedMin !== undefined || parsedMax !== undefined)
      ? {
          price: {
            ...(parsedMin !== undefined ? { gte: parsedMin } : {}),
            ...(parsedMax !== undefined ? { lte: parsedMax } : {}),
          },
        }
      : {}),
  };

  const posts = await prisma.post.findMany({ where });
  return posts;
};

/**
 * GET /posts/:id - détail d’un post (+ user minimal) + drapeau isSaved
 */
type PostWithExtras =
  (Post & {
    postDetail: PostDetail | null;
    user: { username: string; avatar: string | null };
  }) & { isSaved: boolean };

export const getPostService = async (
  id: string,
  token?: string
): Promise<PostWithExtras | null> => {
  // Retrieve the post + detail + user (minimum selection)
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

  if (!post) return null;

  // Decode the userId from the token if it is present
  let userId: string | null = null;
  if (token) {
    try {
      const secret = process.env.JWT_SECRET_KEY as string;
      const payload = jwt.verify(token, secret) as { id?: string } | string;
      if (typeof payload === "object" && payload?.id) {
        userId = payload.id;
      }
    } catch {
      // invalid token userId remains null
    }
  }

  // Check if the post is saved by this user
  let saved = null;
  if (userId) {
    saved = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: id,
        },
      },
    });
  }

  return { ...post, isSaved: !!saved };
};

/**
 * POST /posts - creation of a post + postDetail
 */
export const addPostService = async (
  userId: string,
  postData: AddPostInput["postData"],
  postDetail: AddPostInput["postDetail"]
): Promise<Post> => {
  // Same logic as JS: if required missing, it will crash. Here, it is clearly indicated.
  if (!postData.latitude || !postData.longitude) {
    throw new Error("Latitude and longitude are required");
  }
  if (!postData.images || postData.images.length === 0) {
    throw new Error("At least one image is required");
  }

  return await prisma.post.create({
    data: {
      // we align each field expected by Prisma (avoid the `undefined` of the spread)
      title: postData.title,
      price: postData.price,
      images: postData.images,      // required by the scheme
      address: postData.address,
      city: postData.city,
      bedroom: postData.bedroom,
      bathroom: postData.bathroom,
      latitude: postData.latitude,  // required by the scheme
      longitude: postData.longitude,// required by the scheme
      type: postData.type as Post["type"],
      property: postData.property as Post["property"],

      userId,
      postDetail: {
        create: {
          desc: postDetail.desc,
          utilities: postDetail.utilities ?? null,
          pet: postDetail.pet ?? null,
          income: postDetail.income ?? null,
          size: postDetail.size ?? null,
          school: postDetail.school ?? null,
          bus: postDetail.bus ?? null,
          restaurant: postDetail.restaurant ?? null,
        },
      },
    },
  });
};

/**
 * DELETE /posts/:id - delete (owner only)
 */
export const deletePostService = async (
  id: string,
  tokenUserId: string
): Promise<{ message: string }> => {
  // 1) Post exists?
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) {
    throw new Error("Post not found");
  }

  // 2) Property verified?
  if (post.userId !== tokenUserId) {
    throw new Error("Not Authorized");
  }

  // 3) delete
  await prisma.post.delete({ where: { id } });

  return { message: "Post deleted" };
};
