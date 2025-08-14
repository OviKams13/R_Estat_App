import prisma from "../../config/prismaConnexion.js";

export const getUsersService = async () => {
  return await prisma.user.findMany();
};