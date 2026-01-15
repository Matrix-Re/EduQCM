import { prisma } from "../../config/database.js";
import { apiError, throwError } from "../../utils/error.js";
import { mapSession } from "../../mappers/session.mapper.js";

export const fetchQuestionsByPage = async (sessionId, page = 1) => {
  if (!sessionId) {
    throwError(400, "sessionId is required.");
  }

  // 1. Check the session exists
  if (isNaN(Number(sessionId))) {
    throwError(400, "sessionId must be a valid number.");
  }
  const session = await prisma.session.findUnique({
    where: { id: Number(sessionId) },
  });
  if (!session) {
    throwError(404, "Session not found.");
  }

  // Check the session is still valid
  if (
    !session.status ||
    (session.status !== "started" && session.status !== "assigned")
  ) {
    throwError(403, "Session is no longer valid.");
  }

  // Check session expiration
  const now = new Date();
  if (session.expires_at && session.expires_at < now) {
    throwError(403, "Session has expired.");
  }

  // if the session is assigned, we need to change its status to started
  if (session.status === "assigned") {
    await prisma.session.update({
      where: { id: Number(sessionId) },
      data: { status: "started" },
    });
  }

  const questions = await prisma.question.findMany({
    where: { qcm_id: session.qcm_id },
    include: {
      proposals: true, // Include proposals if needed
    },
  });

  // Determine optimal questions per page
  const optimalQuestionsPerPage = getOptimalQuestionPerPage(questions.length);

  // 2. Retrieve questions for the QCM associated with this session
  const offset = (page - 1) * optimalQuestionsPerPage;
  const totalPages = Math.ceil(questions.length / optimalQuestionsPerPage);

  return mapSession({
    questions: questions.slice(offset, offset + optimalQuestionsPerPage),
    current_page: page,
    total_questions: questions.length,
    questions_per_page: optimalQuestionsPerPage,
    total_pages: totalPages,
    last_page: totalPages == page ? true : false,
  });
};

export const finishSession = async (sessionId) => {
  if (!sessionId) {
    throwError(400, "Session id is required.");
  }
  if (isNaN(Number(sessionId))) {
    throwError(400, "Session id must be a valid number.");
  }

  // 1. Check the session exists
  const session = await prisma.session.findUnique({
    where: { id: Number(sessionId) },
  });
  if (!session) {
    throwError(404, "Session not found.");
  }

  // 2. Retrieve all answers for this session
  const answers = await prisma.answer.findMany({
    where: { session_id: Number(sessionId) },
  });

  if (answers.length === 0) {
    throwError(400, "No answers found for this session.");
  }

  // 3. Retrieve the related proposals (correct ones)
  const proposalIds = answers.map((a) => a.proposal_id);

  const proposals = await prisma.proposal.findMany({
    where: { id: { in: proposalIds } },
  });

  // Compute correct answers
  let correct = 0;

  for (const answer of answers) {
    const proposal = proposals.find((p) => p.id === answer.proposal_id);

    if (!proposal) continue;

    // studentAnswer === proposal.isCorrect
    if (proposal.is_correct) {
      correct++;
    }
  }

  const total = answers.length;

  // Score on 20
  const score = Number(((correct / total) * 20).toFixed(2));

  // 4. Update the session entry
  return prisma.session.update({
    where: { id: Number(sessionId) },
    data: {
      score,
      completion_date: new Date(),
    },
  });
};

function getOptimalQuestionPerPage(totalQuestions) {
  const candidates = [4, 3, 2];

  for (const perPage of candidates) {
    const r = totalQuestions % perPage;
    if (r != 1) {
      return perPage;
    }
  }

  return 1;
}
