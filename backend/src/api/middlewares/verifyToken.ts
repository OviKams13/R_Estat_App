import jwt from "jsonwebtoken";

export const verifyToken = (req: any, res: any, next: any): void => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ message: "Not Authenticated!" });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET_KEY as string;
    const payload = jwt.verify(token, secret) as { id?: string } | string;

    const userId =
      typeof payload === "object" && payload && "id" in payload
        ? (payload as any).id
        : undefined;

    if (!userId) {
      res.status(403).json({ message: "Token is not Valid!" });
      return;
    }

    req.userId = userId;
    next();
  } catch (err) {
    res.status(403).json({ message: "Token is not Valid!" });
  }
};
