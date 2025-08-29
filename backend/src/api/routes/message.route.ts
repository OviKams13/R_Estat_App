import { Router } from "express";
import { addMessage } from "../controllers/message.controller";
import { verifyToken } from "../middlewares/verifyToken";

const router: Router = Router();

router.post("/:chatId", verifyToken, addMessage);

export default router;
