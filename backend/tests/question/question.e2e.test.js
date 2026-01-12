import request from "supertest";
import jwt from "jsonwebtoken";
import { jest } from "@jest/globals";
import { prisma } from "../../src/config/database.js";
import {
  cleanup,
  seedQcm,
  seedQuestion,
  seedProposal,
  createdQuestionIds,
  createdProposalIds,
} from "../seed.js";

describe("Question module (E2E) - token always provided", () => {
  const API_BASE_PATH = process.env.API_BASE_PATH || "/api";
  const QUESTION_BASE = `${API_BASE_PATH}/question`; // change if needed

  let app;
  let token;

  const authHeader = () => ({ Authorization: `Bearer ${token}` });

  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret";

    const mod = await import("../../src/server.js");
    app = mod.default;

    token = jwt.sign({ id: 1, role: "teacher" }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  });

  afterEach(async () => {
    await cleanup();
  });

  // ---------------------------
  // POST /api/question
  // ---------------------------
  describe(`POST ${QUESTION_BASE}`, () => {
    it("should create a question (valid)", async () => {
      const qcm = await seedQcm();

      const res = await request(app)
        .post(QUESTION_BASE)
        .set(authHeader())
        .send({ label: "What is the capital of France?", qcm_id: qcm.id })
        .expect(200);

      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty(
        "label",
        "What is the capital of France?"
      );
      expect(res.body).toHaveProperty("proposals");
      expect(Array.isArray(res.body.proposals)).toBe(true);

      createdQuestionIds.push(res.body.id);
    });

    it("should return 400 if label is missing", async () => {
      const qcm = await seedQcm();

      const res = await request(app)
        .post(QUESTION_BASE)
        .set(authHeader())
        .send({ qcm_id: qcm.id })
        .expect(400);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(
        /label and qcm_id are required/i
      );
    });

    it("should return 400 if qcm_id is missing", async () => {
      const res = await request(app)
        .post(QUESTION_BASE)
        .set(authHeader())
        .send({ label: "X" })
        .expect(400);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(
        /label and qcm_id are required/i
      );
    });

    it("should return 500 on unexpected DB error", async () => {
      const qcm = await seedQcm();

      const originalCreate = prisma.question.create;
      prisma.question.create = jest
        .fn()
        .mockRejectedValue(new Error("DB create error"));

      const res = await request(app)
        .post(QUESTION_BASE)
        .set(authHeader())
        .send({ label: "Crash", qcm_id: qcm.id })
        .expect(500);

      expect(res.body).toHaveProperty("message", "DB create error");

      prisma.question.create = originalCreate;
    });
  });

  // ---------------------------
  // PUT /api/question/:id
  // ---------------------------
  describe(`PUT ${QUESTION_BASE}/:id`, () => {
    it("should update a question (valid)", async () => {
      const question = await seedQuestion();

      const res = await request(app)
        .put(`${QUESTION_BASE}/${question.id}`)
        .set(authHeader())
        .send({ label: "Updated question label" })
        .expect(200);

      expect(res.body).toHaveProperty("id", question.id);
      expect(res.body).toHaveProperty("label", "Updated question label");
    });

    it("should return 400 when id is not a number", async () => {
      const res = await request(app)
        .put(`${QUESTION_BASE}/abc`)
        .set(authHeader())
        .send({ label: "X" })
        .expect(400);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/id|number|invalid/i);
    });

    it("should return 404 if question does not exist", async () => {
      const res = await request(app)
        .put(`${QUESTION_BASE}/999999`)
        .set(authHeader())
        .send({ label: "X" })
        .expect(404);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/does not exist|not found/i);
    });

    it("should return 500 on unexpected DB error", async () => {
      const question = await seedQuestion();

      const originalUpdate = prisma.question.update;
      prisma.question.update = jest
        .fn()
        .mockRejectedValue(new Error("DB update error"));

      const res = await request(app)
        .put(`${QUESTION_BASE}/${question.id}`)
        .set(authHeader())
        .send({ label: "X" })
        .expect(500);

      expect(res.body).toHaveProperty("message", "DB update error");

      prisma.question.update = originalUpdate;
    });
  });

  // ---------------------------
  // GET /api/question/:id
  // ---------------------------
  describe(`GET ${QUESTION_BASE}/:id`, () => {
    it("should return a question by id with proposals", async () => {
      const question = await seedQuestion();
      const p1 = await seedProposal({
        questionId: question.id,
        label: "Paris",
        is_correct: true,
      });
      const p2 = await seedProposal({
        questionId: question.id,
        label: "London",
        is_correct: false,
      });

      const res = await request(app)
        .get(`${QUESTION_BASE}/${question.id}`)
        .set(authHeader())
        .expect(200);

      expect(res.body).toHaveProperty("id", question.id);
      expect(res.body).toHaveProperty("label");

      expect(res.body).toHaveProperty("proposals");
      expect(Array.isArray(res.body.proposals)).toBe(true);

      // Ensure proposals are there (mapper may rename fields)
      const labels = res.body.proposals.map((x) => x.label);
      expect(labels).toEqual(expect.arrayContaining([p1.label, p2.label]));
    });

    it("should return 400 if id is missing/invalid", async () => {
      const res = await request(app)
        .get(`${QUESTION_BASE}/abc`)
        .set(authHeader())
        .expect(400);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(
        /question id is required|id|invalid/i
      );
    });

    it("should return 404 if question not found", async () => {
      const res = await request(app)
        .get(`${QUESTION_BASE}/999999`)
        .set(authHeader())
        .expect(404);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/question not found/i);
    });

    it("should return 500 on unexpected DB error", async () => {
      const originalFindUnique = prisma.question.findUnique;
      prisma.question.findUnique = jest
        .fn()
        .mockRejectedValue(new Error("DB read error"));

      const res = await request(app)
        .get(`${QUESTION_BASE}/1`)
        .set(authHeader())
        .expect(500);

      expect(res.body).toHaveProperty("message", "DB read error");

      prisma.question.findUnique = originalFindUnique;
    });
  });

  // ---------------------------
  // DELETE /api/question/:id
  // ---------------------------
  describe(`DELETE ${QUESTION_BASE}/:id`, () => {
    it("should delete a question and its proposals", async () => {
      const question = await seedQuestion();
      const proposal = await seedProposal({ questionId: question.id });

      const res = await request(app)
        .delete(`${QUESTION_BASE}/${question.id}`)
        .set(authHeader())
        .expect(200);

      expect(res.body).toHaveProperty("id", question.id);

      // question deleted
      const qInDb = await prisma.question.findUnique({
        where: { id: question.id },
      });
      expect(qInDb).toBeNull();

      // proposal deleted (this will ONLY pass if your removeQuestion deletes proposals correctly)
      const pInDb = await prisma.proposal.findUnique({
        where: { id: proposal.id },
      });
      expect(pInDb).toBeNull();
    });

    it("should return 400 if id is missing/invalid", async () => {
      const res = await request(app)
        .delete(`${QUESTION_BASE}/abc`)
        .set(authHeader())
        .expect(400);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/id is required|id|invalid/i);
    });

    it("should return 404 if question not found", async () => {
      const res = await request(app)
        .delete(`${QUESTION_BASE}/999999`)
        .set(authHeader())
        .expect(404);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/question not found/i);
    });

    it("should return 500 on unexpected DB error", async () => {
      const question = await seedQuestion();

      const originalDelete = prisma.question.delete;
      prisma.question.delete = jest
        .fn()
        .mockRejectedValue(new Error("DB delete error"));

      const res = await request(app)
        .delete(`${QUESTION_BASE}/${question.id}`)
        .set(authHeader())
        .expect(500);

      expect(res.body).toHaveProperty("message", "DB delete error");

      prisma.question.delete = originalDelete;
    });
  });
});
