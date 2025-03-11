import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route.js";
// import postRout from ".routes/post.route.js;"

const app = express();

app.use(express.json());
app.use(cookieParser());
dotenv.config();

// app.use("/api/posts", postRout);
app.use("/api/auth", authRoute);

app.listen(8800, () => {
  console.log("Server is running!");
});
