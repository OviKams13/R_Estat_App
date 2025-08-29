import express, { Application } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

// Import of routes
import authRoute from "./api/routes/auth.route";
import userRoute from "./api/routes/user.route";
import postRoute from "./api/routes/post.route";
import chatRoute from "./api/routes/chat.route";
import messageRoute from "./api/routes/message.route";

dotenv.config();

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({ origin: "https://estat-frontend.onrender.com", credentials: true })
);

// Routes
app.use("/api/posts", postRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

// Port
const PORT: number = Number(process.env.PORT) || 8800;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
