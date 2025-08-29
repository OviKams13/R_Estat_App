import { Request, Response } from "express";
import {
  getUsersValidation,
  getUserValidation,
  updateUserValidation,
  deleteUserValidation,
  savePostValidation,
  profilePostsValidation,
  getNotificationNumberValidation,
  // types of inputs if you want to use them here
  GetUserParams,
  UpdateUserInput,
} from "../validations/user.validation";
import {
  getUsersService,
  getUserService,
  updateUserService,
  deleteUserService,
  savePostService,
  profilePostsService,
  getNotificationNumberService,
} from "../services/user.service";

/**
 * Temporary addition of userId to the Request type.
 */
interface RequestWithUser<P = any, ResBody = any, ReqBody = any, ReqQuery = any>
  extends Request<P, ResBody, ReqBody, ReqQuery> {
  userId?: string;
}

/**
 * GET /api/users
 */
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  const { error } = getUsersValidation(req);
  if (error) {
    const message =
      error.details?.[0]?.message ?? error.message ?? "Invalid input";
    res.status(400).json({ message });
    return;
  }

  try {
    const users = await getUsersService();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get users!" });
  }
};

/**
 * GET /api/users/:id
 */
export const getUser = async (
  req: Request<GetUserParams>,
  res: Response
): Promise<void> => {
  const { error } = getUserValidation(req);
  if (error) {
    const message =
      error.details?.[0]?.message ?? error.message ?? "Invalid input";
    res.status(400).json({ message });
    return;
  }

  const id = req.params.id;

  try {
    const user = await getUserService(id);
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get user!" });
  }
};

/**
 * PUT /api/users/:id
 */
export const updateUser = async (
  req: RequestWithUser<GetUserParams, any, Partial<UpdateUserInput>>,
  res: Response
): Promise<void> => {
  const { error } = updateUserValidation(req);
  if (error) {
    const message =
      error.details?.[0]?.message ?? error.message ?? "Invalid input";
    res.status(400).json({ message });
    return;
  }

  const id = req.params.id;
  const tokenUserId = req.userId!; // assured by verifyToken
  const { password, avatar, ...inputs } = req.body;

  try {
    const result = await updateUserService(
      id,
      tokenUserId,
      password,
      avatar,
      inputs
    );

    if ("error" in result) {
      res.status(result.error.status).json({ message: result.error.message });
      return;
    }

    if ("data" in result) {
      res.status(200).json(result.data);
      return;
    }

    // fallback if the service returns { message }
    res.status(200).json({ message: (result as any).message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user!" });
  }
};

/**
 * DELETE /api/users/:id
 */
export const deleteUser = async (
  req: RequestWithUser<GetUserParams>,
  res: Response
): Promise<void> => {
  const { error } = deleteUserValidation(req);
  if (error) {
    const message =
      error.details?.[0]?.message ?? error.message ?? "Invalid input";
    res.status(400).json({ message });
    return;
  }

  const id = req.params.id;
  const tokenUserId = req.userId!;

  try {
    const result = await deleteUserService(id, tokenUserId);

    if ("error" in result) {
      res.status(result.error.status).json({ message: result.error.message });
      return;
    }

    if ("data" in result) {
      res.status(200).json(result.data);
      return;
    }

    res.status(200).json({ message: (result as any).message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete user!" });
  }
};

/**
 * POST /api/users/save-post
 */
export const savePost = async (
  req: RequestWithUser<any, any, { postId: string }>,
  res: Response
): Promise<void> => {
  const { error } = savePostValidation(req);
  if (error) {
    const message =
      error.details?.[0]?.message ?? error.message ?? "Invalid input";
    res.status(400).json({ message });
    return;
  }

  const postId = req.body.postId;
  const tokenUserId = req.userId!;

  try {
    const result = await savePostService(tokenUserId, postId);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save or remove post!" });
  }
};

/**
 * GET /api/users/profile-posts
 */
export const profilePosts = async (
  req: RequestWithUser,
  res: Response
): Promise<void> => {
  const { error } = profilePostsValidation(req);
  if (error) {
    const message =
      error.details?.[0]?.message ?? error.message ?? "Invalid input";
    res.status(400).json({ message });
    return;
  }

  const tokenUserId = req.userId!;

  try {
    const result = await profilePostsService(tokenUserId);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};

/**
 * GET /api/users/notifications/count
 */
export const getNotificationNumber = async (
  req: RequestWithUser,
  res: Response
): Promise<void> => {
  const { error } = getNotificationNumberValidation(req);
  if (error) {
    const message =
      error.details?.[0]?.message ?? error.message ?? "Invalid input";
    res.status(400).json({ message });
    return;
  }

  const tokenUserId = req.userId!;

  try {
    const number = await getNotificationNumberService(tokenUserId);
    res.status(200).json(number);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get notification number!" });
  }
};
