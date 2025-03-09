import express from "express";
import authRout from ".routes/auth.route.js"
import postRout from ".routes/post.route.js"

const app = express();

app.use(express.json())

app.use("/api/posts", postRout);
app.use("/api/auth", authRout);

app.listen(8800, () => {
  console.log(`Server is running on `);
});
