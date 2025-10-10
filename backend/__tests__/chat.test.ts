import supertest from "supertest";
import createServer from "../src/utils/createServer";
import * as chatService from "../src/api/services/chat.service";

const app = createServer();

describe("chat routes", () => {
  describe("get chat by id route", () => {
    // 1. given valid chatId & membership
    describe("given valid chatId & membership", () => {
      it("should return 200 with chat payload", async () => {
        const chatId = "507f1f77bcf86cd799439011";
        const tokenUserId = "607f1f77bcf86cd799439022";

        const mockChat = {
          id: chatId,
          userIDs: [tokenUserId, "709f1f77bcf86cd799439033"],
          lastMessage: "Hello there",
          seenBy: [tokenUserId],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        jest.spyOn(chatService, "getChatService").mockResolvedValueOnce(mockChat as any);

        const res = await supertest(app)
          .get(`/api/chats/${chatId}`)
          .set("userId", tokenUserId);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
          id: expect.any(String),
          userIDs: expect.any(Array),
          lastMessage: expect.any(String),
          seenBy: expect.any(Array),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      });
    });

    // 2. given non-existing chatId
    describe("given non-existing chatId", () => {
      it("should return 404 with message 'Chat not found'", async () => {
        const chatId = "507f1f77bcf86cd799439099";
        const tokenUserId = "607f1f77bcf86cd799439022";

        jest
          .spyOn(chatService, "getChatService")
          .mockRejectedValueOnce(new Error("Chat not found"));

        const res = await supertest(app)
          .get(`/api/chats/${chatId}`)
          .set("userId", tokenUserId);

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ message: "Chat not found" });
      });
    });

    // 3. given invalid chatId format
    describe("given invalid chatId format", () => {
      it("should return 400 invalid input", async () => {
        const invalidChatId = "123";
        const tokenUserId = "607f1f77bcf86cd799439022";

        const res = await supertest(app)
          .get(`/api/chats/${invalidChatId}`)
          .set("userId", tokenUserId);

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("message", expect.any(String));
      });
    });
  });
});
