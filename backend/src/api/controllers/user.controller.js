import {
  getUsersValidation,
  getUserValidation,
  updateUserValidation,
  deleteUserValidation,
  savePostValidation,
  profilePostsValidation,
  getNotificationNumberValidation,
} from "../validations/user.validation.js";
import {
  getUsersService,
  getUserService,
  updateUserService,
  deleteUserService,
  savePostService,
  profilePostsService,
  getNotificationNumberService,
} from "../services/user.service.js";

export const getUsers = async (req, res) => {
  // Validation
  const { error } = getUsersValidation(req);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const users = await getUsersService();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get users!" });
  }
};

export const getUser = async (req, res) => {
  // Validation
  const { error } = getUserValidation(req);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
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

export const updateUser = async (req, res) => {
  // Validation
  const { error } = updateUserValidation(req);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const id = req.params.id;
  const tokenUserId = req.userId;
  const { password, avatar, ...inputs } = req.body;

  try {
    const { error: serviceError, data } = await updateUserService(
      id,
      tokenUserId,
      password,
      avatar,
      inputs
    );

    if (serviceError) {
      return res
        .status(serviceError.status)
        .json({ message: serviceError.message });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update users!" });
  }
};

export const deleteUser = async (req, res) => {
  // Validation
  const { error } = deleteUserValidation(req);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const { error: serviceError, data } = await deleteUserService(
      id,
      tokenUserId
    );

    if (serviceError) {
      return res
        .status(serviceError.status)
        .json({ message: serviceError.message });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete users!" });
  }
};

export const savePost = async (req, res) => {
  // Validation
  const { error } = savePostValidation(req);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const postId = req.body.postId;
  const tokenUserId = req.userId;

  try {
    const result = await savePostService(tokenUserId, postId);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save or remove post!" });
  }
};

export const profilePosts = async (req, res) => {
  // Validation
  const { error } = profilePostsValidation(req);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const tokenUserId = req.userId;

  try {
    const result = await profilePostsService(tokenUserId);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};

export const getNotificationNumber = async (req, res) => {
  // Validation
  const { error } = getNotificationNumberValidation(req);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const tokenUserId = req.userId;

  try {
    const number = await getNotificationNumberService(tokenUserId);
    res.status(200).json(number);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get notification number!" });
  }
};
