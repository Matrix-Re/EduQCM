import request from "supertest";
import app from "../../src/server.js";
import { prisma } from '../../src/config/database.js';
import jwt from "jsonwebtoken";
import { jest } from "@jest/globals";

describe("User E2E Tests - module user only (token always provided)", () => {
  const API_BASE_PATH = process.env.API_BASE_PATH || "/api";

  const createdUserIds = [];
  const createdTopicIds = [];
  const createdQcmIds = [];
  const createdResultIds = [];

  const uniq = (prefix = "u") =>
    `${prefix}_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

  const tokenFor = (id, role = "student") =>
    jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1h" });

  const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

  const seedUser = async (role = "student") => {
    const username = uniq(role);

    const user = await prisma.user.create({
      data: {
        lastname: "TEST",
        firstname: "USER",
        username,
        password: "hashed_password_for_tests",
        ...(role === "student"
          ? { student: { create: {} } }
          : { teacher: { create: {} } }),
      },
      include: { student: true, teacher: true },
    });

    createdUserIds.push(user.id);

    return {
      user,
      token: tokenFor(user.id, role),
      role,
    };
  };

  const cleanup = async () => {
    // FK order matters
    try {
      if (createdResultIds.length) {
        await prisma.result.deleteMany({ where: { id: { in: createdResultIds } } });
      }
      if (createdQcmIds.length) {
        await prisma.qcm.deleteMany({ where: { id: { in: createdQcmIds } } });
      }
      if (createdTopicIds.length) {
        await prisma.topic.deleteMany({ where: { id: { in: createdTopicIds } } });
      }

      // relations share same id as user in your design
      if (createdUserIds.length) {
        await prisma.student.deleteMany({ where: { id: { in: createdUserIds } } });
        await prisma.teacher.deleteMany({ where: { id: { in: createdUserIds } } });
        await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
      }
    } catch (e) {
      // avoid cleanup noise failing tests
    } finally {
      createdResultIds.length = 0;
      createdQcmIds.length = 0;
      createdTopicIds.length = 0;
      createdUserIds.length = 0;
    }
  };

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
      // depending on your service message
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
      prisma.user.findUnique = jest.fn().mockRejectedValue(new Error("DB timeout"));

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
      const payload = { lastname: "UPDATED", firstname: "NAME", username: newUsername };

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

      const after = await prisma.user.findUnique({ where: { id: target.user.id } });
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

      const topic = await prisma.topic.create({
        data: { label: uniq("TOPIC") },
      });
      createdTopicIds.push(topic.id);

      const qcm = await prisma.qcm.create({
        data: {
          label: uniq("QCM"),
          author_id: teacher.user.id,
          topic_id: topic.id,
        },
      });
      createdQcmIds.push(qcm.id);

      const result = await prisma.result.create({
        data: {
          assignment_date: new Date(),
          completion_date: null,
          score: null,
          qcm_id: qcm.id,
          student_id: student.user.id,
        },
      });
      createdResultIds.push(result.id);

      const res = await request(app)
        .get(`${API_BASE_PATH}/users/${student.user.id}/qcm`)
        .set(authHeader(viewer.token))
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);

      // Ici on valide surtout le shape "métier" (ton mapper)
      const item = res.body[0];

      // format attendu (selon ton mapAssignedQcm)
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
