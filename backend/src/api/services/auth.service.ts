import prisma from "../../config/prismaConnexion";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { AuthRegisterInput, AuthLoginInput } from "../validations/auth.validation";

type UserSafe = Omit<User, "password">;

const JWT_EXPIRES_IN = "7d";           // for jsonwebtoken (supported format)
const COOKIE_AGE_MS = 1000 * 60 * 60 * 24 * 7; // 7 days in milliseconds, useful for cookie.maxAge

/**
* Register: creates a user and returns the user without the password.
 */
export const registerService = async (
  { username, email, password }: AuthRegisterInput
): Promise<UserSafe> => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  // Remove the password from return
  const { password: _pwd, ...userSafe } = newUser;
  return userSafe;
};

/**
 * Login: checks credentials, returns a JWT and the user (without password).
 * Throw an Error("Invalid Credentials!") if failed.
 */
export const loginService = async (
  { username, password }: AuthLoginInput
): Promise<{ token: string; userInfo: UserSafe; ageMs: number }> => {
  // 1) user exists?
  const user = await prisma.user.findUnique({
    where: { username },
  });
  if (!user) {
    throw new Error("Invalid Credentials!");
  }

  // 2) password ok?
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid Credentials!");
  }

  // 3) generate the token (use a non-empty secret)
  const secret = process.env.JWT_SECRET_KEY as string;
  if (!secret) {
    throw new Error("Server misconfiguration: JWT_SECRET_KEY is missing");
  }

  const token = jwt.sign(
    { id: user.id /*, isAdmin: false */ },
    secret,
    { expiresIn: JWT_EXPIRES_IN } // '7d' (not in milliseconds)
  );

  // 4) clean the user
  const { password: _pwd, ...userInfo } = user;

  return { token, userInfo, ageMs: COOKIE_AGE_MS };
};
