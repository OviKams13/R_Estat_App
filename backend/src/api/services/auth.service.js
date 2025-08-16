import prisma from "../../config/prismaConnexion.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerService = async ({ username, email, password }) => {
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  return newUser;
};

export const loginService = async ({ username, password }) => {
  // Check if the user exists
  const user = await prisma.user.findUnique({
    where: { username },
  });
  if (!user) {
    throw new Error("Invalid Credentials!");
  }

  // Check if the password is correct
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid Credentials!");
  }

  // Generate the JWT token
  const age = 1000 * 60 * 60 * 24 * 7; // 7 days
  const token = jwt.sign(
    {
      id: user.id,
      // isAdmin: false,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: age }
  );

  // Delete the password before sending
  const { password: userPassword, ...userInfo } = user;

  return { token, userInfo, age };
};
