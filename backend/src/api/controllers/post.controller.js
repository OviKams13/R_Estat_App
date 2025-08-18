import {
  getPostsValidation,
  getPostValidation,
  addPostValidation,
  deletePostValidation,
} from "../validations/post.validation.js";
import {
  getPostsService,
  getPostService,
  addPostService,
  deletePostService,
} from "../services/post.service.js";

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
  const tokenUserId = req.userId;
  const body = req.body;

  // Validation
  const { error } = addPostValidation(body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const newPost = await addPostService(
      tokenUserId,
      body.postData,
      body.postDetail
    );
    res.status(200).json(newPost);
  } catch (err) {
    console.error(err);
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
  const { id } = req.params;
  const tokenUserId = req.userId;

  // Validation
  const { error } = deletePostValidation({ id });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const result = await deletePostService(id, tokenUserId);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    if (err.message === "Not Authorized") {
      return res.status(403).json({ message: err.message });
    }
    if (err.message === "Post not found") {
      return res.status(404).json({ message: err.message });
    }
    res.status(500).json({ message: "Failed to delete post" });
  }
};
