import { Request, Response } from "express";
import { addMessageValidation, MessageInput } from "../validations/message.validation";
import { addMessageService } from "../services/message.service";

// Extended request (we will replace it with a global declaration at the middleware point)
interface RequestWithUser<P = any, Res = any, Body = any, Query = any>
  extends Request<P, Res, Body, Query> {
  userId?: string;
}

// Precise typing of the params and the body for this route
type Params = { chatId: string };
type Body = { text: string };

/**
 * POST /api/messages/:chatId
 */
export const addMessage = async (
  req: RequestWithUser<Params, any, Body>,
  res: Response
): Promise<void> => {
  const tokenUserId = req.userId;
  const { chatId } = req.params; // <-- now chatId: string
  const { text } = req.body;     // <-- text: string

  // Entry validation (Joi)
  const { error } = addMessageValidation({ chatId, text } as MessageInput);
  if (error) {
    const message = error.details?.[0]?.message ?? error.message ?? "Invalid input";
    res.status(400).json({ message });
    return;
  }

  if (!tokenUserId) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  try {
    const message = await addMessageService({ chatId, text, tokenUserId });
    res.status(200).json(message);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to add message!";
    const status = msg === "Chat not found!" ? 404 : 500;
    console.error(err);
    res.status(status).json({ message: msg });
  }
};
