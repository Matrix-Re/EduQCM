import { prisma } from "../../config/database.js";
import { throwError } from "../../utils/error.js";
import { mapAnswer } from "../../mappers/answer.mapper.js";

export const submitAnswer = async ({ session_id, proposal_id }) => {
  if (!session_id || !proposal_id) {
    throwError(400, "Session and proposal id are required.");
  }

  // 1. Verify session exists (sessionId = QCM assigned to a student)
  const session = await prisma.session.findUnique({
    where: { id: Number(session_id) },
  });
  if (!session) {
    throwError(404, "Session not found.");
  }

  // 2. Verify proposal exists
  const proposal = await prisma.proposal.findUnique({
    where: { id: Number(proposal_id) },
  });
  if (!proposal) {
    throwError(404, "Proposal not found.");
  }

  // 3. Insert or update the answer (avoid duplicates)
  return mapAnswer(
    await prisma.answer.upsert({
      where: {
        session_id_proposal_id: {
          session_id: Number(session_id),
          proposal_id: Number(proposal_id),
        },
      },
      create: {
        session_id: Number(session_id),
        proposal_id: Number(proposal_id),
      },
      update: {
        proposal_id: Number(proposal_id),
      },
    })
  );
};
