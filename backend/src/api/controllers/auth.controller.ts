import { Request, Response } from "express";
import {
  registerValidation,
  loginValidation,
  AuthRegisterInput,
  AuthLoginInput,
} from "../validations/auth.validation";
import { registerService, loginService } from "../services/auth.service";

/**
 * POST /api/auth/register
 */
export const register = async (
  req: Request<unknown, unknown, AuthRegisterInput>,
  res: Response
): Promise<void> => {
  const { error } = registerValidation(req.body);
  if (error) {
    const message =
      error.details?.[0]?.message ?? error.message ?? "Invalid input";
    res.status(400).json({ message });
    return;
  }

  try {
    await registerService(req.body);
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create user!";
    console.error(err);
    res.status(500).json({ message });
  }
};

/**
 * POST /api/auth/login
 */
export const login = async (
  req: Request<unknown, unknown, AuthLoginInput>,
  res: Response
): Promise<void> => {
  const { error } = loginValidation(req.body);
  if (error) {
    const message =
      error.details?.[0]?.message ?? error.message ?? "Invalid input";
    res.status(400).json({ message });
    return;
  }

  try {
    const { token, userInfo, ageMs } = await loginService(req.body);

    // Cookies: secure in production, more permissive in dev
    const isProd = process.env.NODE_ENV === "production";
    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: ageMs, // 7 days in ms (service)
        secure: isProd, // true on prod (HTTPS)
        sameSite: isProd ? "none" : "lax",
      })
      .status(200)
      .json(userInfo);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to login!";
    console.error(err);
    res.status(400).json({ message });
  }
};

/**
 * POST /api/auth/logout
 */
export const logout = async (_req: Request, res: Response): Promise<void> => {
  const isProd = process.env.NODE_ENV === "production";
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    })
    .status(200)
    .json({ message: "Logout Successful" });
};
