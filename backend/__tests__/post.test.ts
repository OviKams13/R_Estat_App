import supertest from "supertest";
import createServer from "../src/utils/createServer";
import * as postService from "../src/api/services/post.service";
import { GetPostsQuery } from "../src/api/validations/post.validation";

const app = createServer();

describe("post routes", () => {
  describe("get posts route", () => {
    // 1. given valid filters → should return 200 with array of posts
    describe("given valid filters", () => {
      it("should return 200 with array of posts", async () => {
        const query: GetPostsQuery = {
          city: "Paris",
          type: "rent",
          property: "apartment",
          bedroom: 2,
          minPrice: 500,
          maxPrice: 1500,
        };

        const mockPosts = [
          {
            id: "1",
            title: "Beautiful apartment",
            city: "Paris",
            type: "rent",
            property: "apartment",
            bedroom: 2,
            price: 1200,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "2",
            title: "Cozy studio",
            city: "Paris",
            type: "rent",
            property: "apartment",
            bedroom: 1,
            price: 900,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];

        jest
          .spyOn(postService, "getPostsService")
          .mockResolvedValueOnce(mockPosts as any);

        const res = await supertest(app).get("/api/posts").query(query);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toEqual({
          id: expect.any(String),
          title: expect.any(String),
          city: expect.any(String),
          type: expect.any(String),
          property: expect.any(String),
          bedroom: expect.any(Number),
          price: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      });
    });

    // 2. given invalid filters → should return 400 invalid input
    describe("given invalid filters", () => {
      it("should return 400 invalid input", async () => {
        const invalidQueries = [
          { type: "buyyy" }, // invalid enum
          { property: "castle" }, // invalid enum
          { minPrice: -50 }, // negative price
          { bedroom: -1 }, // negative bedroom
        ];

        for (const q of invalidQueries) {
          const res = await supertest(app).get("/api/posts").query(q);
          expect(res.statusCode).toBe(400);
          expect(res.body).toHaveProperty("message", expect.any(String));
        }
      });
    });

    // 3. given DB/service failure → should return 500 with error message
    describe("given DB/service failure", () => {
      it("should return 500 with error message", async () => {
        const query: GetPostsQuery = {
          city: "Berlin",
          type: "buy",
        };

        jest
          .spyOn(postService, "getPostsService")
          .mockRejectedValueOnce(new Error("Database error occurred"));

        const res = await supertest(app).get("/api/posts").query(query);

        expect(res.statusCode).toBe(500);
        expect(res.body).toEqual({
          message: "Failed to get posts",
        });
      });
    });
  });
});
