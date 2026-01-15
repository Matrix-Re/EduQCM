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

describe("Session module (E2E)", () => {
  const API_BASE_PATH = process.env.API_BASE_PATH || "/api";

  const SESSION_QUESTIONS = (sessionId) =>
    `${API_BASE_PATH}/session/${sessionId}/questions`;
  const SESSION_FINISH = (sessionId) =>
    `${API_BASE_PATH}/session/${sessionId}/finish`;

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
    //await cleanup();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // ---------------------------------------
  // GET /session/:id/questions?page=...
  // ---------------------------------------
  describe("GET session questions by page", () => {
    it("should return paginated questions (valid)", async () => {
      const qcm = await seedQcm();
      const student = await seedUser("student");

      // IMPORTANT: ton service force questions.length = 9 => seed au moins 9 questions
      const questions = [];
      for (let i = 0; i < 9; i++) {
        const q = await seedQuestion(qcm.id);
        questions.push(q);

        // proposals pour chaque question
        await seedProposal(q.id, `P1_${i}`, true);
        await seedProposal(q.id, `P2_${i}`, false);
      }

      const session = await seedSession(qcm.id, student.user.id);

      const res = await request(app)
        .get(`${SESSION_QUESTIONS(session.id)}?page=1`)
        .set(authHeader())
        .expect(200);

      expect(res.body).toHaveProperty("questions");
      expect(Array.isArray(res.body.questions)).toBe(true);

      expect(res.body).toHaveProperty("current_page", 1);
      expect(res.body).toHaveProperty("total_questions", 9);
      expect(res.body).toHaveProperty("questions_per_page");
      expect(res.body).toHaveProperty("total_pages");
      expect(res.body).toHaveProperty("last_page");

      // include proposals
      expect(res.body.questions[0]).toHaveProperty("proposals");
      expect(Array.isArray(res.body.questions[0].proposals)).toBe(true);
    });

    it("should return 400 if sessionId is invalid", async () => {
      const res = await request(app)
        .get(`${SESSION_QUESTIONS("abc")}?page=1`)
        .set(authHeader())
        .expect(400);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(
        /sessionId must be a valid number/i
      );
    });

    it("should return 404 if session not found", async () => {
      const res = await request(app)
        .get(`${SESSION_QUESTIONS(999999)}?page=1`)
        .set(authHeader())
        .expect(404);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/session not found/i);
    });

    it("should return 403 if session is not valid (status)", async () => {
      const qcm = await seedQcm();
      const student = await seedUser("student");

      // seed at least 9 to avoid holes if your controller calls service
      for (let i = 0; i < 9; i++) {
        const q = await seedQuestion(qcm.id);
        await seedProposal(q.id, `P1_${i}`, true);
      }

      const session = await seedSession(qcm.id, student.user.id, "completed");

      const res = await request(app)
        .get(`${SESSION_QUESTIONS(session.id)}?page=1`)
        .set(authHeader())
        .expect(403);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/no longer valid/i);
    });

    it("should return 403 if session has expired", async () => {
      const qcm = await seedQcm();
      const student = await seedUser("student");
      for (let i = 0; i < 9; i++) {
        const q = await seedQuestion(qcm.id);
        await seedProposal(q.id, `P1_${i}`, true);
      }

      const session = await seedSession(
        qcm.id,
        student.user.id,
        "started",
        new Date(Date.now() - 60 * 10000)
      );

      const res = await request(app)
        .get(`${SESSION_QUESTIONS(session.id)}?page=1`)
        .set(authHeader())
        .expect(403);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/expired/i);
    });

    it("should switch session status from assigned -> started on first call", async () => {
      const qcm = await seedQcm();
      const student = await seedUser("student");
      for (let i = 0; i < 9; i++) {
        const q = await seedQuestion(qcm.id);
        await seedProposal(q.id, `P1_${i}`, true);
      }

      const session = await seedSession(qcm.id, student.user.id);

      await request(app)
        .get(`${SESSION_QUESTIONS(session.id)}?page=1`)
        .set(authHeader())
        .expect(200);

      const updated = await prisma.session.findUnique({
        where: { id: session.id },
      });
      expect(updated.status).toBe("started");
    });
  });

  // ---------------------------------------
  // PUT /session/:sessionId/finish
  // ---------------------------------------
  describe("PUT finish session", () => {
    it("should compute score and set completionDate (valid)", async () => {
      const student = await seedUser("student");
      const qcm = await seedQcm();

      const result = await seedSession(qcm.id, student.user.id);
      const sessionId = result.sessionId ?? result.id;

      const question = await seedQuestion(qcm.id);

      // Create 5 proposals: 3 correct, 2 incorrect
      const p1 = await seedProposal(question.id, "Proposal 1", true);
      const p2 = await seedProposal(question.id, "Proposal 2", true);
      const p3 = await seedProposal(question.id, "Proposal 3", true);
      const p4 = await seedProposal(question.id, "Proposal 4", false);
      const p5 = await seedProposal(question.id, "Proposal 5", false);
      // IMPORTANT: ton service lit ProposalId + isCorrect
      // => on récupère ProposalId si dispo, sinon id
      const proposals = [p1, p2, p3, p4, p5].map((p) => ({
        id: p.ProposalId ?? p.id,
        isCorrect: p.isCorrect ?? p.is_correct,
      }));

      // studentAnswer === proposal.isCorrect => correct++
      // on simule 3 correct sur 5
      await seedAnswer(sessionId, proposals[0].id);
      await seedAnswer(sessionId, proposals[1].id);
      await seedAnswer(sessionId, proposals[2].id);
      await seedAnswer(sessionId, proposals[3].id); // wrong
      await seedAnswer(sessionId, proposals[4].id); // wrong
      const res = await request(app)
        .put(SESSION_FINISH(sessionId))
        .set(authHeader())
        .send({})
        .expect(200);

      expect(res.body).toHaveProperty("score");
      expect(res.body).toHaveProperty("completion_date");

      const expectedScore = Number(((3 / 5) * 20).toFixed(2));
      expect(Number(res.body.score)).toBe(expectedScore);
    });

    it("should return 400 if sessionId is invalid", async () => {
      const res = await request(app)
        .put(SESSION_FINISH("abc"))
        .set(authHeader())
        .send({})
        .expect(400);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(
        /Session id must be a valid number./i
      );
    });

    it("should return 404 if session not found", async () => {
      const res = await request(app)
        .put(SESSION_FINISH(999999))
        .set(authHeader())
        .send({})
        .expect(404);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/Session not found/i);
    });

    it("should return 400 if no answers found", async () => {
      const student = await seedUser("student");
      const qcm = await seedQcm();

      const result = await seedSession(qcm.id, student.user.id);
      const sessionId = result.sessionId ?? result.id;

      const res = await request(app)
        .put(SESSION_FINISH(sessionId))
        .set(authHeader())
        .send({})
        .expect(400);

      expect(res.body).toHaveProperty("message");
      expect(String(res.body.message)).toMatch(/no answers found/i);
    });
  });
});
