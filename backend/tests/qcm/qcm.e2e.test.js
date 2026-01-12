import request from "supertest";
import app from "../../src/server.js";
import { prisma } from "../../src/config/database.js";
import jwt from "jsonwebtoken";
import { jest } from "@jest/globals";
import {
  cleanup,
  uniq,
  createdQcmIds,
  seedQcm,
  seedTopic,
  seedUser,
} from "../seed.js";

describe("QCM E2E Tests - token always provided", () => {
  const API_BASE_PATH = process.env.API_BASE_PATH || "/api";
  const QCM_BASE = `${API_BASE_PATH}/qcm`;

  let token;

  const authHeader = (token) => ({ Authorization: `Bearer ${token}` });

  beforeAll(async () => {
    // Ensure a JWT secret exists for tests
    process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret";

    // We are "already connected": token is enough (we don't test auth here)
    token = jwt.sign({ id: 1, role: "teacher" }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  });

  afterEach(async () => {
    await cleanup();
  });

  // ---------------------------
  // POST /api/qcm
  // ---------------------------
  describe(`POST ${QCM_BASE}`, () => {
    it("should create a QCM (valid)", async () => {
      const viewer = await seedUser("teacher");

      // Seed topic first before creating QCM
      const topic = await seedTopic();

      const label = uniq("European Capitals");
      const res = await request(app)
        .post(QCM_BASE)
        .set(authHeader(viewer.token))
        .send({
          label,
          author_id: viewer.user.id,
          topic_id: topic.id, // Associate QCM to existing topic
        })
        .expect(200);

      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("label", label);

      createdQcmIds.push(res.body.id);
    });

    it("should return 404 when topic does not exist (404)", async () => {
      const viewer = await seedUser("teacher");

      const label = uniq("European Capitals");
      const res = await request(app)
        .post(QCM_BASE)
        .set(authHeader(viewer.token))
        .send({
          label,
          author_id: 99999,
          topic_id: 99999, // Associate QCM to existing topic
        })
        .expect(404);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(
        "The specified teacher does not exist."
      );
    });

    it("should return 404 when topic does not exist (404)", async () => {
      const viewer = await seedUser("teacher");

      const label = uniq("European Capitals");
      const res = await request(app)
        .post(QCM_BASE)
        .set(authHeader(viewer.token))
        .send({
          label,
          author_id: viewer.user.id,
          topic_id: 99999, // Associate QCM to existing topic
        })
        .expect(404);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(
        "The specified topic does not exist."
      );
    });

    it("should return 400 when label is missing (400)", async () => {
      const viewer = await seedUser("teacher");

      const res = await request(app)
        .post(QCM_BASE)
        .set(authHeader(viewer.token))
        .send({
          author_id: viewer.user.id,
          topic_id: 1,
        })
        .expect(400);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(
        /label, author_id and topic_id are required/i
      );
    });
  });

  // ---------------------------
  // GET /api/qcm
  // ---------------------------
  describe(`GET ${QCM_BASE}`, () => {
    it("should return all QCMs (valid)", async () => {
      const viewer = await seedUser("teacher");

      const q1 = await seedQcm();
      const q2 = await seedQcm();
      createdQcmIds.push(q1.id, q2.id);

      const res = await request(app)
        .get(QCM_BASE)
        .set(authHeader(viewer.token))
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(2);

      const ids = res.body.map((q) => q.id);
      expect(ids).toContain(q1.id);
      expect(ids).toContain(q2.id);
    });

    it("should return 500 on unexpected error", async () => {
      const viewer = await seedUser("teacher");

      const originalFindMany = prisma.qcm.findMany;
      prisma.qcm.findMany = jest.fn().mockRejectedValue(new Error("DB error"));

      const res = await request(app)
        .get(QCM_BASE)
        .set(authHeader(viewer.token))
        .expect(500);

      expect(res.body).toHaveProperty("message", "DB error");

      prisma.qcm.findMany = originalFindMany;
    });
  });

  // ---------------------------
  // GET /qcm/:id
  // ---------------------------
  describe(`GET ${API_BASE_PATH}/qcm/:id`, () => {
    it("should return a single QCM by ID (valid)", async () => {
      const viewer = await seedUser("teacher");

      // Seed QCM
      const qcm = await seedQcm();

      const res = await request(app)
        .get(`${API_BASE_PATH}/qcm/${qcm.id}`)
        .set(authHeader(viewer.token))
        .expect(200);

      expect(res.body).toHaveProperty("id", qcm.id);
      expect(res.body).toHaveProperty("label", qcm.label);
      expect(res.body).toHaveProperty("topic.id", qcm.topic_id);
    });

    it("should return 400 if id is not a valid number", async () => {
      const viewer = await seedUser("teacher");

      const res = await request(app)
        .get(`${API_BASE_PATH}/qcm/abc`)
        .set(authHeader(viewer.token))
        .expect(400);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/qcmId must be a valid number/i);
    });

    it("should return 404 if QCM not found", async () => {
      const viewer = await seedUser("teacher");

      const res = await request(app)
        .get(`${API_BASE_PATH}/qcm/999999`)
        .set(authHeader(viewer.token))
        .expect(404);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/QCM not found/i);
    });

    it("should return 500 on unexpected error", async () => {
      const viewer = await seedUser("teacher");

      const originalFindUnique = prisma.qcm.findUnique;
      prisma.qcm.findUnique = jest
        .fn()
        .mockRejectedValue(new Error("DB error"));

      const res = await request(app)
        .get(`${API_BASE_PATH}/qcm/1`)
        .set(authHeader(viewer.token))
        .expect(500);

      expect(res.body).toHaveProperty("message", "DB error");

      prisma.qcm.findUnique = originalFindUnique;
    });
  });

  // ---------------------------
  // PUT /api/qcm/:id
  // ---------------------------
  describe(`PUT ${QCM_BASE}/:id`, () => {
    it("should update QCM (valid)", async () => {
      const viewer = await seedUser("teacher");
      const topic = await seedTopic();

      const qcm = await seedQcm();

      const newLabel = uniq("Updated Title");
      const res = await request(app)
        .put(`${QCM_BASE}/${qcm.id}`)
        .set(authHeader(viewer.token))
        .send({ label: newLabel })
        .expect(200);

      expect(res.body).toHaveProperty("id", qcm.id);
      expect(res.body).toHaveProperty("label", newLabel);
    });

    it("should return 400 when id is invalid", async () => {
      const viewer = await seedUser("teacher");

      const res = await request(app)
        .put(`${QCM_BASE}/abc`)
        .set(authHeader(viewer.token))
        .send({ label: "Updated" })
        .expect(400);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(
        /Qcm id must be a valid number/i
      );
    });

    it("should return 404 if QCM not found", async () => {
      const viewer = await seedUser("teacher");

      const res = await request(app)
        .put(`${QCM_BASE}/999999`)
        .set(authHeader(viewer.token))
        .send({ label: "New Label" })
        .expect(404);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/QCM not found/i);
    });

    it("should return 404 if topic not found", async () => {
      const viewer = await seedUser("teacher");
      const qcm = await seedQcm();

      const res = await request(app)
        .put(`${QCM_BASE}/${qcm.id}`)
        .set(authHeader(viewer.token))
        .send({
          label: "New Label",
          topic_id: 99999,
        })
        .expect(404);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(
        /The specified topic does not exist/i
      );
    });

    it("should return 500 on unexpected error", async () => {
      const viewer = await seedUser("teacher");

      const qcm = await seedQcm();

      const originalUpdate = prisma.qcm.update;
      prisma.qcm.update = jest.fn().mockRejectedValue(new Error("DB error"));

      const res = await request(app)
        .put(`${QCM_BASE}/${qcm.id}`)
        .set(authHeader(viewer.token))
        .send({ label: "New Label" })
        .expect(500);

      expect(res.body).toHaveProperty("message", "DB error");

      prisma.qcm.update = originalUpdate;
    });
  });

  // ---------------------------
  // DELETE /api/qcm/:id
  // ---------------------------
  describe(`DELETE ${QCM_BASE}/:id`, () => {
    it("should delete QCM (valid)", async () => {
      const viewer = await seedUser("teacher");

      const qcm = await seedQcm();

      const res = await request(app)
        .delete(`${QCM_BASE}/${qcm.id}`)
        .set(authHeader(viewer.token))
        .expect(200);

      expect(res.body).toHaveProperty("id", qcm.id);
      expect(res.body).toHaveProperty("label", qcm.label);

      const after = await prisma.qcm.findUnique({ where: { id: qcm.id } });
      expect(after).toBeNull();
    });

    it("should return 400 when id is invalid", async () => {
      const viewer = await seedUser("teacher");

      const res = await request(app)
        .delete(`${QCM_BASE}/abc`)
        .set(authHeader(viewer.token))
        .expect(400);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/qcmId must be a valid number/i);
    });

    it("should return 404 if QCM not found", async () => {
      const viewer = await seedUser("teacher");

      const res = await request(app)
        .delete(`${QCM_BASE}/999999`)
        .set(authHeader(viewer.token))
        .expect(404);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/QCM not found/i);
    });

    it("should return 500 on unexpected error", async () => {
      const viewer = await seedUser("teacher");

      const qcm = await seedQcm();

      const originalDelete = prisma.qcm.delete;
      prisma.qcm.delete = jest
        .fn()
        .mockRejectedValue(new Error("DB delete error"));

      const res = await request(app)
        .delete(`${QCM_BASE}/${qcm.id}`)
        .set(authHeader(viewer.token))
        .expect(500);

      expect(res.body).toHaveProperty("message", "DB delete error");

      prisma.qcm.delete = originalDelete;
    });
  });

  // ---------------------------
  // POST /api/qcm/:id/assign
  // ---------------------------
  describe(`POST ${QCM_BASE}/:id/assign`, () => {
    it("should assign a QCM to a student (valid)", async () => {
      const teacher = await seedUser("teacher");
      const student = await seedUser("student");
      const qcm = await seedQcm();

      const res = await request(app)
        .post(`${QCM_BASE}/${qcm.id}/assign`)
        .set(authHeader(teacher.token))
        .send({
          student_id: student.user.id,
        })
        .expect(200);

      expect(res.body).toHaveProperty("qcm.id", qcm.id);
      expect(res.body).toHaveProperty("assignedAt");
      expect(res.body).toHaveProperty("completedAt", null);
      expect(res.body).toHaveProperty("score", null);
    });

    it("should return 400 if student_id is missing", async () => {
      const teacher = await seedUser("teacher");

      const res = await request(app)
        .post(`${QCM_BASE}/1/assign`)
        .set(authHeader(teacher.token))
        .send({})
        .expect(400);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(
        /Qcm id and student id are required/i
      );
    });

    it("should return 400 if student_id is invalid", async () => {
      const teacher = await seedUser("teacher");

      const res = await request(app)
        .post(`${QCM_BASE}/1/assign`)
        .set(authHeader(teacher.token))
        .send({
          student_id: "invalid", // Invalid student_id
        })
        .expect(400);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(
        /Qcm id and student id must be valid numbers/i
      );
    });

    it("should return 404 if QCM not found", async () => {
      const teacher = await seedUser("teacher");
      const student = await seedUser("student");

      const res = await request(app)
        .post(`${QCM_BASE}/999999/assign`) // Non-existent QCM
        .set(authHeader(teacher.token))
        .send({
          student_id: student.user.id,
        })
        .expect(404);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/QCM not found/i);
    });

    it("should return 404 if student not found", async () => {
      const teacher = await seedUser("teacher");
      const qcm = await seedQcm();

      const res = await request(app)
        .post(`${QCM_BASE}/${qcm.id}/assign`)
        .set(authHeader(teacher.token))
        .send({
          student_id: 999999, // Non-existent student
        })
        .expect(404);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/Student not found/i);
    });
  });
});
