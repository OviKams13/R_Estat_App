import supertest from "supertest";
import createServer from "../src/utils/createServer";
import * as authService from "../src/api/services/auth.service"; // pour mocker
import { AuthRegisterInput } from "../src/api/validations/auth.validation";

const app = createServer();

describe("auth routes", () => {
  describe("register route", () => {
    // 1. given valid username, email, password → should return 201
    describe("given valid username, email, password", () => {
      it("should return 201 with message 'User created successfully'", async () => {
        const input: AuthRegisterInput = {
          username: "testuser",
          email: "test@example.com",
          password: "strongpassword",
        };

        jest.spyOn(authService, "registerService").mockResolvedValueOnce({
          id: "507f1f77bcf86cd799439011",
          username: input.username,
          email: input.email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as any);

        const res = await supertest(app)
          .post("/api/auth/register")
          .send(input);

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
          message: "User created successfully",
        });
      });
    });

    // 2. given invalid input → should return 400
    describe("given invalid input", () => {
      it("should return 400 invalid input", async () => {
        const invalidPayloads = [
          { username: "a", email: "invalid", password: "123" }, // all invalid
          { username: "", email: "test@example.com", password: "123" }, // empty username
          { username: "test", email: "bademail", password: "123456" }, // bad email
        ];

        for (const payload of invalidPayloads) {
          const res = await supertest(app)
            .post("/api/auth/register")
            .send(payload);

          expect(res.statusCode).toBe(400);
          expect(res.body).toHaveProperty("message", expect.any(String));
        }
      });
    });

    // 3. given duplicate email/username (Prisma unique constraint)
    describe("given duplicate email or username", () => {
      it("should return 500 with error message", async () => {
        const input: AuthRegisterInput = {
          username: "duplicateUser",
          email: "duplicate@example.com",
          password: "password123",
        };

        jest
          .spyOn(authService, "registerService")
          .mockRejectedValueOnce(new Error("Unique constraint failed on the fields: (`email`)"));

        const res = await supertest(app)
          .post("/api/auth/register")
          .send(input);

        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({
          message: expect.stringContaining("Unique constraint failed"),
        });
      });
    });

    // 4. given server misconfiguration or DB error
    describe("given a DB or server error", () => {
      it("should return 500 with generic error message", async () => {
        const input: AuthRegisterInput = {
          username: "crashUser",
          email: "crash@example.com",
          password: "123456789",
        };

        jest
          .spyOn(authService, "registerService")
          .mockRejectedValueOnce(new Error("Database connection failed"));

        const res = await supertest(app)
          .post("/api/auth/register")
          .send(input);

        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({
          message: expect.stringContaining("Database connection failed"),
        });
      });
    });
  });
});
