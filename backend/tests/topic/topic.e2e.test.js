import request from "supertest";
import jwt from "jsonwebtoken";
import { jest } from "@jest/globals";
import { prisma } from "../../src/config/database.js";
import { cleanup, createdTopicLabels, seedTopic } from "../seed.js";

describe("Topic module (E2E) - token always provided", () => {
  const API_BASE_PATH = process.env.API_BASE_PATH || "/api";
  const TOPIC_BASE = `${API_BASE_PATH}/topic`;

  let app;
  let token;

  const uniq = (prefix = "topic") =>
    `${prefix}_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

  const authHeader = () => ({ Authorization: `Bearer ${token}` });

  beforeAll(async () => {
    // Ensure a JWT secret exists for tests
    process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret";

    // Import app after env is ready (important in ESM)
    const mod = await import("../../src/server.js");
    app = mod.default;

    // We are "already connected": token is enough (we don't test auth here)
    token = jwt.sign({ id: 1, role: "teacher" }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  });

  afterEach(async () => {
    await cleanup();
  });

  // ---------------------------
  // POST /api/topic
  // ---------------------------
  describe(`POST ${TOPIC_BASE}`, () => {
    it("should create a topic (valid)", async () => {
      const label = uniq("Physics");

      const res = await request(app)
        .post(TOPIC_BASE)
        .set(authHeader())
        .send({ label })
        .expect(200);

      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("label", label);

      // Track for cleanup
      createdTopicLabels.push(res.body.label);
    });

    it("should return 400 when label is missing", async () => {
      const res = await request(app)
        .post(TOPIC_BASE)
        .set(authHeader())
        .send({})
        .expect(400);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/label is required/i);
    });

    it("should return 400 when label is blank", async () => {
      const res = await request(app)
        .post(TOPIC_BASE)
        .set(authHeader())
        .send({ label: "   " })
        .expect(400);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/label is required/i);
    });

    it("should return 500 on unexpected error", async () => {
      const originalCreate = prisma.topic.create;
      prisma.topic.create = jest
        .fn()
        .mockRejectedValue(new Error("DB create error"));

      const res = await request(app)
        .post(TOPIC_BASE)
        .set(authHeader())
        .send({ label: uniq("Crash") })
        .expect(500);

      expect(res.body).toHaveProperty("message", "DB create error");

      prisma.topic.create = originalCreate;
    });
  });

  // ---------------------------
  // GET /api/topic
  // ---------------------------
  describe(`GET ${TOPIC_BASE}`, () => {
    it("should return all topics (valid)", async () => {
      const t1 = await seedTopic();
      const t2 = await seedTopic();

      const res = await request(app)
        .get(TOPIC_BASE)
        .set(authHeader())
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);

      const ids = res.body.map((t) => t.id);
      expect(ids).toContain(t1.id);
      expect(ids).toContain(t2.id);

      // Minimum shape
      expect(res.body[0]).toHaveProperty("id");
      expect(res.body[0]).toHaveProperty("label");
    });

    it("should return 500 on unexpected error", async () => {
      const originalFindMany = prisma.topic.findMany;
      prisma.topic.findMany = jest
        .fn()
        .mockRejectedValue(new Error("DB list error"));

      const res = await request(app)
        .get(TOPIC_BASE)
        .set(authHeader())
        .expect(500);

      expect(res.body).toHaveProperty("message", "DB list error");

      prisma.topic.findMany = originalFindMany;
    });
  });

  // ---------------------------
  // GET /api/topic/:id
  // ---------------------------
  describe(`GET ${TOPIC_BASE}/:id`, () => {
    it("should return one topic (valid)", async () => {
      const topic = await seedTopic();

      const res = await request(app)
        .get(`${TOPIC_BASE}/${topic.id}`)
        .set(authHeader())
        .expect(200);

      expect(res.body).toHaveProperty("id", topic.id);
      expect(res.body).toHaveProperty("label", topic.label);
    });

    it("should return 400 when id is not a number", async () => {
      const res = await request(app)
        .get(`${TOPIC_BASE}/abc`)
        .set(authHeader())
        .expect(400);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/must be a number/i);
    });

    it("should return 404 when topic not found", async () => {
      const res = await request(app)
        .get(`${TOPIC_BASE}/999999`)
        .set(authHeader())
        .expect(404);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/not found/i);
    });

    it("should return 500 on unexpected error", async () => {
      const originalFindUnique = prisma.topic.findUnique;
      prisma.topic.findUnique = jest
        .fn()
        .mockRejectedValue(new Error("DB get error"));

      const res = await request(app)
        .get(`${TOPIC_BASE}/1`)
        .set(authHeader())
        .expect(500);

      expect(res.body).toHaveProperty("message", "DB get error");

      prisma.topic.findUnique = originalFindUnique;
    });
  });

  // ---------------------------
  // PUT /api/topic/:id
  // ---------------------------
  describe(`PUT ${TOPIC_BASE}/:id`, () => {
    it("should return 400 if topic id is missing", async () => {
      const res = await request(app)
        .put(`${API_BASE_PATH}/topic/abc`)
        .set(authHeader())
        .send({ label: "X" })
        .expect(400);

      const msg = res.body.message;
      expect(msg).toBeTruthy();
      expect(String(msg)).toMatch(/must be a number/i);
    });

    it("should update a topic (valid)", async () => {
      const topic = await seedTopic();

      const res = await request(app)
        .put(`${TOPIC_BASE}/${topic.id}`)
        .set(authHeader())
        .send({ label: "  New Label  " })
        .expect(200);

      expect(res.body).toHaveProperty("id", topic.id);
      // service trims label
      expect(res.body).toHaveProperty("label", "New Label");
    });

    it("should return 400 when id is not a number", async () => {
      const res = await request(app)
        .put(`${TOPIC_BASE}/abc`)
        .set(authHeader())
        .send({ label: "X" })
        .expect(400);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/must be a number/i);
    });

    it("should return 400 when label is empty", async () => {
      const topic = await seedTopic();

      const res = await request(app)
        .put(`${TOPIC_BASE}/${topic.id}`)
        .set(authHeader())
        .send({ label: "   " })
        .expect(400);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/non-empty string/i);
    });

    it("should return 404 when topic not found", async () => {
      const res = await request(app)
        .put(`${TOPIC_BASE}/999999`)
        .set(authHeader())
        .send({ label: "X" })
        .expect(404);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/not found/i);
    });

    it("should return 500 on unexpected error", async () => {
      // Need an existing topic so it passes "existing" check, then fail update
      const topic = await seedTopic();

      const originalUpdate = prisma.topic.update;
      prisma.topic.update = jest
        .fn()
        .mockRejectedValue(new Error("DB update error"));

      const res = await request(app)
        .put(`${TOPIC_BASE}/${topic.id}`)
        .set(authHeader())
        .send({ label: "X" })
        .expect(500);

      expect(res.body).toHaveProperty("message", "DB update error");

      prisma.topic.update = originalUpdate;
    });
  });

  // ---------------------------
  // DELETE /api/topic/:id
  // ---------------------------
  describe(`DELETE ${TOPIC_BASE}/:id`, () => {
    it("should delete a topic (valid)", async () => {
      const topic = await seedTopic();

      const res = await request(app)
        .delete(`${TOPIC_BASE}/${topic.id}`)
        .set(authHeader())
        .expect(200);

      // service returns deleted topic mapped
      expect(res.body).toHaveProperty("id", topic.id);
      expect(res.body).toHaveProperty("label", topic.label);

      const after = await prisma.topic.findUnique({ where: { id: topic.id } });
      expect(after).toBeNull();
    });

    it("should return 400 when id is not a number", async () => {
      const res = await request(app)
        .delete(`${TOPIC_BASE}/abc`)
        .set(authHeader())
        .expect(400);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/must be a number/i);
    });

    it("should return 404 when topic not found", async () => {
      const res = await request(app)
        .delete(`${TOPIC_BASE}/999999`)
        .set(authHeader())
        .expect(404);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/not found/i);
    });

    it("should return 500 on unexpected error", async () => {
      const topic = await seedTopic();

      const originalDelete = prisma.topic.delete;
      prisma.topic.delete = jest
        .fn()
        .mockRejectedValue(new Error("DB delete error"));

      const res = await request(app)
        .delete(`${TOPIC_BASE}/${topic.id}`)
        .set(authHeader())
        .expect(500);

      expect(res.body).toHaveProperty("message", "DB delete error");

      prisma.topic.delete = originalDelete;
    });
  });
});
