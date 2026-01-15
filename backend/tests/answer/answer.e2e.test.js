import request from "supertest";
import { prisma } from "../../src/config/database.js";
import {
  cleanup,
  seedUser,
  seedQcm,
  seedQuestion,
  seedProposal,
  seedSession,
  seedAnswer,
} from "../seed.js";

describe("Answer module (E2E)", () => {
  const API_BASE_PATH = process.env.API_BASE_PATH || "/api";
  const ANSWER_BASE = `${API_BASE_PATH}/answer`; // change if needed

  let app;
  let token;

  const authHeader = () => ({ Authorization: `Bearer ${token}` });

  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret";

    const mod = await import("../../src/server.js");
    app = mod.default;

    const viewer = await seedUser("teacher");
    token = viewer.token;
  });

  afterEach(async () => {
    await cleanup();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe(`POST ${ANSWER_BASE}`, () => {
    it("should submit an answer successfully (create)", async () => {
      const qcm = await seedQcm();
      const student = await seedUser("student");
      const question = await seedQuestion(qcm.id);
      const proposal = await seedProposal(question.id, undefined, true);

      const session = await seedSession(qcm.id, student.user.id, "started");

      const proposalId = proposal.ProposalId ?? proposal.id;

      const res = await request(app)
        .post(ANSWER_BASE)
        .set(authHeader())
        .send({
          session_id: session.id,
          proposal_id: proposalId,
        })
        .expect(200);

      expect(res.body).toHaveProperty("session_id", session.id);
      expect(res.body).toHaveProperty("proposal_id", proposalId);

      // DB check
      const inDb = await prisma.answer.findUnique({
        where: {
          session_id_proposal_id: {
            session_id: session.id,
            proposal_id: proposalId,
          },
        },
      });

      expect(inDb).toBeTruthy();
      expect(inDb.session_id).toBe(session.id);
      expect(inDb.proposal_id).toBe(proposalId);
    });

    it("should upsert (update) when same session_id + proposal_id is submitted twice", async () => {
      const qcm = await seedQcm();
      const student = await seedUser("student");
      const question = await seedQuestion(qcm.id);
      const proposal = await seedProposal(question.id, undefined, true);
      const session = await seedSession(qcm.id, student.user.id, "started");

      const proposalId = proposal.ProposalId ?? proposal.id;

      // create once (via seedAnswer) to ensure second call is update path
      await seedAnswer(session.id, proposalId);
      // ⚠️ If your Answer model is session-based (session_id/proposal_id),
      // and seedAnswer currently inserts resultId/proposalId, then replace this with a direct prisma.answer.create.
      // See note below.

      const res = await request(app)
        .post(ANSWER_BASE)
        .set(authHeader())
        .send({
          session_id: session.id,
          proposal_id: proposalId,
        })
        .expect(200);

      expect(res.body).toHaveProperty("session_id", session.id);
      expect(res.body).toHaveProperty("proposal_id", proposalId);
    });

    it("should return 400 if session_id is missing", async () => {
      const res = await request(app)
        .post(ANSWER_BASE)
        .set(authHeader())
        .send({ proposal_id: 1 })
        .expect(400);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/required/i);
    });

    it("should return 400 if proposal_id is missing", async () => {
      const res = await request(app)
        .post(ANSWER_BASE)
        .set(authHeader())
        .send({ session_id: 1 })
        .expect(400);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/required/i);
    });

    it("should return 404 if session not found", async () => {
      const qcm = await seedQcm();
      const question = await seedQuestion(qcm.id);
      const proposal = await seedProposal(question.id, undefined, true);

      const proposalId = proposal.ProposalId ?? proposal.id;

      const res = await request(app)
        .post(ANSWER_BASE)
        .set(authHeader())
        .send({ session_id: 999999, proposal_id: proposalId })
        .expect(404);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/session not found/i);
    });

    it("should return 404 if proposal not found", async () => {
      const qcm = await seedQcm();
      const student = await seedUser("student");
      const session = await seedSession(qcm.id, student.user.id, "started");

      const res = await request(app)
        .post(ANSWER_BASE)
        .set(authHeader())
        .send({ session_id: session.id, proposal_id: 999999 })
        .expect(404);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/proposal not found/i);
    });
  });
});
