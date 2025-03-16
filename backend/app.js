import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import authRoute from "./routes/auth.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
// import postRout from ".routes/post.route.js;"

const app = express();

app.use(express.json());
app.use(cookieParser());
dotenv.config();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// app.use("/api/posts", postRout);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/test", testRoute);

app.listen(8800, () => {
  console.log("Server is running!");
});
