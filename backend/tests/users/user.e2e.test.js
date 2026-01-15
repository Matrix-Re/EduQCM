import request from "supertest";
import app from "../../src/server.js";
import { prisma } from "../../src/config/database.js";
import { jest } from "@jest/globals";
import {
  cleanup,
  uniq,
  seedQcm,
  seedTopic,
  seedUser,
  seedSession,
} from "../seed.js";

describe("User E2E Tests - token always provided", () => {
  const API_BASE_PATH = process.env.API_BASE_PATH || "/api";

  const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

  afterEach(async () => {
    await cleanup();
  });

  // ---------------------------
  // GET /api/users
  // ---------------------------
  describe(`GET ${API_BASE_PATH}/users`, () => {
    it("should return users (valid)", async () => {
      const viewer = await seedUser("student");
      await seedUser("teacher");

      const res = await request(app)
        .get(`${API_BASE_PATH}/users`)
        .set(authHeader(viewer.token))
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(2);

      const me = res.body.find((u) => u.id === viewer.user.id);
      expect(me).toBeTruthy();
      expect(me).toHaveProperty("role");
      expect(["student", "teacher", "unknown"]).toContain(me.role);
      expect(me).not.toHaveProperty("password");
      expect(me).not.toHaveProperty("refresh_token");
    });

    it("should handle unexpected errors (500)", async () => {
      const viewer = await seedUser("student");

      const originalFindMany = prisma.user.findMany;
      prisma.user.findMany = jest.fn().mockRejectedValue(new Error("DB error"));

      const res = await request(app)
        .get(`${API_BASE_PATH}/users`)
        .set(authHeader(viewer.token))
        .expect(500);

      expect(res.body).toHaveProperty("message", "DB error");

      prisma.user.findMany = originalFindMany;
    });
  });

  // ---------------------------
  // GET /api/users/:id
  // ---------------------------
  describe(`GET ${API_BASE_PATH}/users/:id`, () => {
    it("should return one user (valid)", async () => {
      const viewer = await seedUser("student");
      const target = await seedUser("teacher");

      const res = await request(app)
        .get(`${API_BASE_PATH}/users/${target.user.id}`)
        .set(authHeader(viewer.token))
        .expect(200);

      expect(res.body).toHaveProperty("id", target.user.id);
      expect(res.body).toHaveProperty("username", target.user.username);
      expect(res.body).toHaveProperty("role", "teacher");
      expect(res.body).not.toHaveProperty("password");
    });

    it("should fail with invalid id (missing/invalid input -> 400)", async () => {
      const viewer = await seedUser("student");

      const res = await request(app)
        .get(`${API_BASE_PATH}/users/abc`)
        .set(authHeader(viewer.token))
        .expect(400);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/id/i);
    });

    it("should return 404 if user not found", async () => {
      const viewer = await seedUser("student");

      const res = await request(app)
        .get(`${API_BASE_PATH}/users/999999`)
        .set(authHeader(viewer.token))
        .expect(404);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/not found/i);
    });

    it("should handle not found user (404)", async () => {
      const viewer = await seedUser("student");

      const originalFindUnique = prisma.user.findUnique;
      prisma.user.findUnique = jest
        .fn()
        .mockRejectedValue(new Error("DB timeout"));

      const res = await request(app)
        .get(`${API_BASE_PATH}/users/1`)
        .set(authHeader(viewer.token))
        .expect(404);

      expect(res.body).toHaveProperty("message", "DB timeout");

      prisma.user.findUnique = originalFindUnique;
    });
  });

  // ---------------------------
  // PUT /api/users/:id
  // ---------------------------
  describe(`PUT ${API_BASE_PATH}/users/:id`, () => {
    it("should update user (valid)", async () => {
      const viewer = await seedUser("student");
      const target = await seedUser("student");

      const newUsername = uniq("updated");
      const payload = {
        lastname: "UPDATED",
        firstname: "NAME",
        username: newUsername,
      };

      const res = await request(app)
        .put(`${API_BASE_PATH}/users/${target.user.id}`)
        .set(authHeader(viewer.token))
        .send(payload)
        .expect(200);

      expect(res.body).toHaveProperty("id", target.user.id);
      expect(res.body).toHaveProperty("lastname", "UPDATED");
      expect(res.body).toHaveProperty("firstname", "NAME");
      expect(res.body).toHaveProperty("username", newUsername);
      expect(res.body).toHaveProperty("role", "student");
      expect(res.body).not.toHaveProperty("password");
    });

    it("should fail with invalid id (missing/invalid input -> 400)", async () => {
      const viewer = await seedUser("student");

      const res = await request(app)
        .put(`${API_BASE_PATH}/users/abc`)
        .set(authHeader(viewer.token))
        .send({ lastname: "X" })
        .expect(400);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/id/i);
    });

    it("should return 404 if user not found", async () => {
      const viewer = await seedUser("student");

      const res = await request(app)
        .put(`${API_BASE_PATH}/users/999999`)
        .set(authHeader(viewer.token))
        .send({ lastname: "X" })
        .expect(404);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/not found/i);
    });
  });

  // ---------------------------
  // DELETE /api/users/:id
  // ---------------------------
  describe(`DELETE ${API_BASE_PATH}/users/:id`, () => {
    it("should delete user (valid)", async () => {
      const viewer = await seedUser("student");
      const target = await seedUser("teacher");

      await request(app)
        .delete(`${API_BASE_PATH}/users/${target.user.id}`)
        .set(authHeader(viewer.token))
        .expect(200);

      const after = await prisma.user.findUnique({
        where: { id: target.user.id },
      });
      expect(after).toBeNull();
    });

    it("should fail with invalid id (missing/invalid input -> 400)", async () => {
      const viewer = await seedUser("student");

      const res = await request(app)
        .delete(`${API_BASE_PATH}/users/abc`)
        .set(authHeader(viewer.token))
        .expect(400);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/id/i);
    });

    it("should return 404 if user not found", async () => {
      const viewer = await seedUser("student");

      const res = await request(app)
        .delete(`${API_BASE_PATH}/users/999999`)
        .set(authHeader(viewer.token))
        .expect(404);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/not found/i);
    });
  });

  // ---------------------------
  // GET /api/users/:id/qcm
  // ---------------------------
  describe(`GET ${API_BASE_PATH}/users/:id/qcm`, () => {
    it("should return assigned QCM for student (valid)", async () => {
      const viewer = await seedUser("student");
      const student = await seedUser("student");
      const teacher = await seedUser("teacher");
      const topic = await seedTopic();
      const qcm = await seedQcm();
      const result = await seedSession(qcm.id, student.user.id);

      const res = await request(app)
        .get(`${API_BASE_PATH}/users/${student.user.id}/qcm`)
        .set(authHeader(viewer.token))
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);

      const item = res.body[0];

      // formats and properties
      expect(item).toHaveProperty("assignmentId");
      expect(item).toHaveProperty("qcm");
      expect(item.qcm).toHaveProperty("id");
      expect(item.qcm).toHaveProperty("label");

      expect(item).toHaveProperty("topic");
      expect(item.topic).toHaveProperty("id");
      expect(item.topic).toHaveProperty("label");

      expect(item).toHaveProperty("author");
      expect(item.author).toHaveProperty("id");
      expect(item.author).toHaveProperty("firstname");
      expect(item.author).toHaveProperty("lastname");

      expect(item).toHaveProperty("assignedAt");
      expect(item).toHaveProperty("completedAt");
      expect(item).toHaveProperty("score");
      expect(item).toHaveProperty("status");
      expect(["assigned", "completed"]).toContain(item.status);
    });

    it("should fail with invalid id (missing/invalid input -> 400)", async () => {
      const viewer = await seedUser("student");

      const res = await request(app)
        .get(`${API_BASE_PATH}/users/abc/qcm`)
        .set(authHeader(viewer.token))
        .expect(400);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/student|id/i);
    });

    it("should return 404 if student not found", async () => {
      const viewer = await seedUser("student");

      const res = await request(app)
        .get(`${API_BASE_PATH}/users/999999/qcm`)
        .set(authHeader(viewer.token))
        .expect(404);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/student.*not found|not found/i);
    });
  });
});
