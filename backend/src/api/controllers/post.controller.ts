import { Request, Response, RequestHandler } from "express";
import {
  getPostsValidation,
  getPostValidation,
  addPostValidation,
  deletePostValidation,
  GetPostsQuery,
  GetPostParams,
  AddPostInput,
} from "../validations/post.validation";
import {
  getPostsService,
  getPostService,
  addPostService,
  deletePostService,
} from "../services/post.service";

// req étendu: injecté par le middleware d'auth
export type RequestWithUser<
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> = Request<P, ResBody, ReqBody, ReqQuery> & {
  userId?: string;
};

/**
 * GET /api/posts
 */
export const getPosts = async (
  req: Request<unknown, unknown, unknown, GetPostsQuery>,
  res: Response
): Promise<void> => {
  const query = req.query;

  const { error } = getPostsValidation(query);
  if (error) {
    const message =
      error.details?.[0]?.message ?? error.message ?? "Invalid input";
    res.status(400).json({ message });
    return;
  }

  try {
    const posts = await getPostsService(query);
    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

/**
 * GET /api/posts/:id
 */
export const getPost = async (
  req: Request<GetPostParams>,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const { error } = getPostValidation({ id });
  if (error) {
    const message =
      error.details?.[0]?.message ?? error.message ?? "Invalid input";
    res.status(400).json({ message });
    return;
  }

  try {
    const token = (req as any).cookies?.token as string | undefined;
    const postWithSaved = await getPostService(id, token);

    if (!postWithSaved) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    res.status(200).json(postWithSaved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get post" });
  }
};

/**
 * POST /api/posts
 */
export const addPost = async (
  req: RequestWithUser<unknown, unknown, AddPostInput>,
  res: Response
): Promise<void> => {
  const tokenUserId = req.userId;
  const body = req.body;

  const { error } = addPostValidation(body);
  if (error) {
    const message =
      error.details?.[0]?.message ?? error.message ?? "Invalid input";
    res.status(400).json({ message });
    return;
  }

  if (!tokenUserId) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  try {
    const newPost = await addPostService(
      tokenUserId,
      body.postData,
      body.postDetail
    );
    res.status(200).json(newPost);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create post";
    // business errors returned by the service (ex: required fields)
    const status = message.includes("required") ? 400 : 500;
    console.error(err);
    res.status(status).json({ message });
  }
};

/**
 * PUT /api/posts/:id
 * (placeholder: not yet implemented on the service side)
 */
export const updatePost = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    res.status(200).json();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update posts" });
  }
};

/**
 * DELETE /api/posts/:id
 */
export const deletePost = async (
  req: RequestWithUser<GetPostParams>,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const { error } = deletePostValidation({ id });
  if (error) {
    const message =
      error.details?.[0]?.message ?? error.message ?? "Invalid input";
    res.status(400).json({ message });
    return;
  }

  const tokenUserId = req.userId;
  if (!tokenUserId) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  try {
    const result = await deletePostService(id, tokenUserId);
    res.status(200).json(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to delete post";
    console.error(err);
    if (message === "Not Authorized") {
      res.status(403).json({ message });
      return;
    }
    if (message === "Post not found") {
      res.status(404).json({ message });
      return;
    }
    res.status(500).json({ message: "Failed to delete post" });
  }
};
