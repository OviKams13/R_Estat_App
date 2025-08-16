import prisma from "../../config/prismaConnexion.js";
import jwt from "jsonwebtoken";
import {
  getPostsValidation,
  getPostValidation,
} from "../validations/post.validation.js";
import { getPostsService, getPostService } from "../services/post.service.js";

export const getPosts = async (req, res) => {
  const query = req.query;

  // Validation
  const { error } = getPostsValidation(query);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const posts = await getPostsService(query);
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;

  // Validation
  const { error } = getPostValidation({ id });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const token = req.cookies?.token;
    const postWithSaved = await getPostService(id, token);
    res.status(200).json(postWithSaved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get post" });
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        postDetail: {
          create: body.postDetail,
        },
      },
    });
    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

export const updatePost = async (req, res) => {
  try {
    res.status(200).json();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update posts" });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    await prisma.post.delete({
      where: { id },
    });

    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};
