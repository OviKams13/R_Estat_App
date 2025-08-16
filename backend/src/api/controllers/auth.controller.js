import {
  registerValidation,
  loginValidation,
} from "../validations/auth.validation.js";
import { registerService, loginService } from "../services/auth.service.js";

export const register = async (req, res) => {
  // Validation
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    await registerService(req.body);
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create user!" });
  }
};

export const login = async (req, res) => {
  // Validation
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { token, userInfo, age } = await loginService(req.body);

    res
      .cookie("token", token, {
        httpOnly: true,
        // secure: true, // to activate in prod
        maxAge: age,
      })
      .status(200)
      .json(userInfo);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || "Failed to login!" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};
