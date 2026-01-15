import request from "supertest";
import jwt from "jsonwebtoken";
import { jest } from "@jest/globals";
import { prisma } from "../../src/config/database.js";
import {
  cleanup,
  seedQuestion,
  seedProposal,
  createdProposalIds,
} from "../seed.js";

describe("Proposal module (E2E) - token always provided", () => {
  const API_BASE_PATH = process.env.API_BASE_PATH || "/api";
  const PROPOSAL_BASE = `${API_BASE_PATH}/proposal`; // <-- change if your route differs

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
  // POST /api/proposal
  // ---------------------------
  describe(`POST ${PROPOSAL_BASE}`, () => {
    it("should create a proposal (valid)", async () => {
      const question = await seedQuestion();

      const res = await request(app)
        .post(PROPOSAL_BASE)
        .set(authHeader())
        .send({
          label: "Paris",
          is_correct: true,
          question_id: question.id,
        })
        .expect(200);

      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("label", "Paris");
      // mapper can return is_correct OR isCorrect depending on your mapProposal
      expect(res.body.is_correct === true || res.body.isCorrect === true).toBe(
        true
      );

      createdProposalIds.push(res.body.id);
    });

    it("should return 400 when label is missing", async () => {
      const question = await seedQuestion();

      const res = await request(app)
        .post(PROPOSAL_BASE)
        .set(authHeader())
        .send({ is_correct: true, question_id: question.id })
        .expect(400);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/required/i);
    });

    it("should return 400 when is_correct is missing", async () => {
      const question = await seedQuestion();

      const res = await request(app)
        .post(PROPOSAL_BASE)
        .set(authHeader())
        .send({ label: "X", question_id: question.id })
        .expect(400);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/required/i);
    });

    it("should return 400 when question_id is missing", async () => {
      const res = await request(app)
        .post(PROPOSAL_BASE)
        .set(authHeader())
        .send({ label: "X", is_correct: false })
        .expect(400);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/required/i);
    });

    it("should return 404 when question does not exist", async () => {
      const res = await request(app)
        .post(PROPOSAL_BASE)
        .set(authHeader())
        .send({ label: "X", is_correct: false, question_id: 999999 })
        .expect(404);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(
        /question.*does not exist|not found/i
      );
    });

    it("should return 500 on unexpected DB error", async () => {
      const question = await seedQuestion();

      const originalCreate = prisma.proposal.create;
      prisma.proposal.create = jest
        .fn()
        .mockRejectedValue(new Error("DB create error"));

      const res = await request(app)
        .post(PROPOSAL_BASE)
        .set(authHeader())
        .send({ label: "Crash", is_correct: false, question_id: question.id })
        .expect(500);

      expect(res.body).toHaveProperty("message", "DB create error");

      prisma.proposal.create = originalCreate;
    });
  });

  // ---------------------------
  // PUT /api/proposal/:id
  // ---------------------------
  describe(`PUT ${PROPOSAL_BASE}/:id`, () => {
    it("should update a proposal (valid)", async () => {
      const proposal = await seedProposal(null, "OLD", false);

      const res = await request(app)
        .put(`${PROPOSAL_BASE}/${proposal.id}`)
        .set(authHeader())
        .send({ label: "NEW", is_correct: true })
        .expect(200);

      expect(res.body).toHaveProperty("id", proposal.id);
      expect(res.body).toHaveProperty("label", "NEW");
      expect(res.body.is_correct === true || res.body.isCorrect === true).toBe(
        true
      );
    });

    it("should return 400 when id is not a number", async () => {
      const res = await request(app)
        .put(`${PROPOSAL_BASE}/abc`)
        .set(authHeader())
        .send({ label: "X" })
        .expect(400);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/must be a number|invalid/i);
    });

    it("should return 404 when proposal not found", async () => {
      const res = await request(app)
        .put(`${PROPOSAL_BASE}/999999`)
        .set(authHeader())
        .send({ label: "X" })
        .expect(404);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/does not exist|not found/i);
    });

    it("should return 500 on unexpected DB error", async () => {
      const proposal = await seedProposal();

      const originalUpdate = prisma.proposal.update;
      prisma.proposal.update = jest
        .fn()
        .mockRejectedValue(new Error("DB update error"));

      const res = await request(app)
        .put(`${PROPOSAL_BASE}/${proposal.id}`)
        .set(authHeader())
        .send({ label: "X" })
        .expect(500);

      expect(res.body).toHaveProperty("message", "DB update error");

      prisma.proposal.update = originalUpdate;
    });
  });

  // ---------------------------
  // DELETE /api/proposal/:id
  // ---------------------------
  describe(`DELETE ${PROPOSAL_BASE}/:id`, () => {
    it("should delete a proposal (valid)", async () => {
      const proposal = await seedProposal();

      const res = await request(app)
        .delete(`${PROPOSAL_BASE}/${proposal.id}`)
        .set(authHeader())
        .expect(200);

      expect(res.body).toHaveProperty("id", proposal.id);

      const inDb = await prisma.proposal.findUnique({
        where: { id: proposal.id },
      });
      expect(inDb).toBeNull();
    });

    it("should return 400 when id is not a number", async () => {
      const res = await request(app)
        .delete(`${PROPOSAL_BASE}/abc`)
        .set(authHeader())
        .expect(400);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/must be a number|invalid/i);
    });

    it("should return 500 on unexpected DB error", async () => {
      const proposal = await seedProposal();

      const originalDelete = prisma.proposal.delete;
      prisma.proposal.delete = jest
        .fn()
        .mockRejectedValue(new Error("DB delete error"));

      const res = await request(app)
        .delete(`${PROPOSAL_BASE}/${proposal.id}`)
        .set(authHeader())
        .expect(500);

      expect(res.body).toHaveProperty("message", "DB delete error");

      prisma.proposal.delete = originalDelete;
    });
  });
});
