import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import authRoute from "./api/routes/auth.route.js";
import userRoute from "./api/routes/user.route.js";
import postRoute from "./api/routes/post.route.js";
import chatRoute from "./api/routes/chat.route.js";
import messageRoute from "./api/routes/message.route.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
dotenv.config();
app.use(cors({ origin: "https://estat-frontend.onrender.com", credentials: true }));

app.use("/api/posts", postRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/test", testRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

app.listen(8800, () => {
  console.log("Server is running!");
});
