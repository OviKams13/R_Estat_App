import dotenv from "dotenv";
import createServer from "./utils/createServer";

dotenv.config();

const PORT: number = Number(process.env.PORT) || 8800;

// Create an instance of the Express app
const app = createServer();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("PORT:", process.env.PORT);
});
