import { Router } from "express";
import { getChats, getChat, addChat, readChat } from "../controllers/chat.controller";
import { verifyToken } from "../middlewares/verifyToken";

const router: Router = Router();

router.get("/", verifyToken, getChats);
router.get("/:id", verifyToken, getChat);
router.post("/", verifyToken, addChat);
router.put("/read/:id", verifyToken, readChat);

export default router;