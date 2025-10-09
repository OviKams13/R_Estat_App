import supertest from "supertest";
import createServer from "../src/utils/createServer";
import * as userService from "../src/api/services/user.service"; // import service to mock

const app = createServer();

describe("user routes", () => {
  describe("get user route", () => {
    // 1. given valid userId → should return 200 with user payload
    describe("given a valid userId", () => {
      it("should return 200 with user payload", async () => {
        const mockUser = {
          id: "507f1f77bcf86cd799439011",
          email: "test@example.com",
          username: "tester",
          password: "hashedpassword",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        jest.spyOn(userService, "getUserService").mockResolvedValueOnce(mockUser as any);

        const res = await supertest(app).get(`/api/users/${mockUser.id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
          id: expect.any(String),
          email: expect.any(String),
          username: expect.any(String),
          password: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      });
    });

    // 2. given malformed userId → should return 400 invalid input
    describe("given a malformed userId", () => {
      it("should return 400 invalid input", async () => {
        const res = await supertest(app).get(`/api/users/123`);

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("message", expect.any(String));
      });
    });

    // 3. given well-formed but non-existing userId → should return 200 with null
    describe("given a well-formed but non-existing userId", () => {
      it("should return 200 with null payload", async () => {
        const id = "507f1f77bcf86cd799439022"; // valid 24-char ObjectId format

        jest.spyOn(userService, "getUserService").mockResolvedValueOnce(null);

        const res = await supertest(app).get(`/api/users/${id}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeNull();
      });
    });

    // 4. given service/DB failure → should return 500
    describe("given the service throws an error", () => {
      it("should return 500 with error message", async () => {
        const id = "507f1f77bcf86cd799439033";

        jest.spyOn(userService, "getUserService").mockRejectedValueOnce(new Error("DB down"));

        const res = await supertest(app).get(`/api/users/${id}`);

        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({ message: "Failed to get user!" });
      });
    });
  });
});
