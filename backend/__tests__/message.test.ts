import supertest from "supertest";
import createServer from "../src/utils/createServer";
import * as messageService from "../src/api/services/message.service";
import { MessageInput } from "../src/api/validations/message.validation";

const app = createServer();

describe("message routes", () => {
  describe("add message route", () => {
    // 1. given valid chatId, text, and authenticated user
    describe("given valid chatId, text, and authenticated user", () => {
      it("should return 200 with created message payload", async () => {
        const chatId = "507f1f77bcf86cd799439011";
        const tokenUserId = "607f1f77bcf86cd799439022";
        const payload: MessageInput = { chatId, text: "Hello World" };

        const mockMessage = {
          id: "709f1f77bcf86cd799439033",
          chatId,
          userId: tokenUserId,
          text: payload.text,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        jest.spyOn(messageService, "addMessageService").mockResolvedValueOnce(mockMessage as any);

        const res = await supertest(app)
          .post(`/api/messages/${chatId}`)
          .set("Authorization", `Bearer faketoken`)
          .send(payload)
          .set("userId", tokenUserId); // simulate middleware

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
          id: expect.any(String),
          chatId: expect.any(String),
          userId: expect.any(String),
          text: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      });
    });

    // 2. given invalid input
    describe("given invalid input", () => {
      it("should return 400 invalid input", async () => {
        const invalidPayloads = [
          { chatId: "", text: "Hello" },
          { chatId: "507f1f77bcf86cd799439011", text: "" },
          { chatId: undefined, text: "Test" },
        ];

        for (const payload of invalidPayloads) {
          const res = await supertest(app)
            .post("/api/messages/invalid")
            .send(payload);

          expect(res.statusCode).toBe(400);
          expect(res.body).toHaveProperty("message", expect.any(String));
        }
      });
    });

    // 3. given no tokenUserId
    describe("given no tokenUserId (unauthenticated request)", () => {
      it("should return 401 Not authenticated", async () => {
        const chatId = "507f1f77bcf86cd799439011";
        const payload = { text: "Hello unauthorized" };

        const res = await supertest(app)
          .post(`/api/messages/${chatId}`)
          .send(payload);

        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual({ message: "Not authenticated" });
      });
    });

    // 4. given chat not found or user not member
    describe("given chat does not exist or user not member", () => {
      it("should return 404 with message 'Chat not found!'", async () => {
        const chatId = "507f1f77bcf86cd799439011";
        const tokenUserId = "607f1f77bcf86cd799439022";
        const payload = { chatId, text: "Hey" };

        jest
          .spyOn(messageService, "addMessageService")
          .mockRejectedValueOnce(new Error("Chat not found!"));

        const res = await supertest(app)
          .post(`/api/messages/${chatId}`)
          .set("userId", tokenUserId)
          .send(payload);

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ message: "Chat not found!" });
      });
    });

    // 5. given DB/service failure
    describe("given DB or service failure", () => {
      it("should return 500 with error message", async () => {
        const chatId = "507f1f77bcf86cd799439011";
        const tokenUserId = "607f1f77bcf86cd799439022";
        const payload = { chatId, text: "DB crash" };

        jest
          .spyOn(messageService, "addMessageService")
          .mockRejectedValueOnce(new Error("Database timeout"));

        const res = await supertest(app)
          .post(`/api/messages/${chatId}`)
          .set("userId", tokenUserId)
          .send(payload);

        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ message: "Database timeout" });
      });
    });
  });
});
