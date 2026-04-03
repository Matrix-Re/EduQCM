import { prisma } from "../../config/database.js";
import { mapProposal } from "../../mappers/proposal.mapper.js";
import { throwError } from "../../utils/error.js";

/**
 * Create a proposal for a question
 */
export const createProposal = async ({ label, is_correct, question_id }) => {
  if (!label || is_correct === undefined || !question_id) {
    throwError(400, "FIELD_MISSING");
  }

  // Check that the question exists
  const question = await prisma.question.findUnique({
    where: { id: Number(question_id) },
  });

  if (!question) {
    throwError(404, "QUESTION_NOT_FOUND");
  }

  // Create proposal
  return mapProposal(
    await prisma.proposal.create({
      data: {
        label,
        is_correct,
        question_id: Number(question_id),
      },
    })
  );
};

/**
 * Modify a proposal
 */
export const modifyProposal = async (id, { label, is_correct }) => {
  if (!id) {
    throwError(400, "PROPOSAL_ID_REQUIRED");
  }

  if (Number.isNaN(Number(id))) {
    throwError(400, "PROPOSAL_ID_MUST_BE_A_NUMBER");
  }

  // Check if the proposal exist
  const proposal = await prisma.proposal.findUnique({
    where: { id: Number(id) },
  });
  if (!proposal) {
    throwError(404, "PROPOSAL_NOT_FOUND");
  }

  return mapProposal(
    await prisma.proposal.update({
      where: { id: Number(id) },
      data: {
        label: label ?? undefined,
        is_correct: is_correct ?? undefined,
      },
    })
  );
};

/**
 * Delete a proposal
 */
export const removeProposal = async (id) => {
  if (!id) {
    throwError(400, "PROPOSAL_ID_REQUIRED");
  }

  if (Number.isNaN(Number(id))) {
    throwError(400, "PROPOSAL_ID_MUST_BE_A_NUMBER");
  }

  return mapProposal(
    await prisma.proposal.delete({
      where: { id: Number(id) },
    })
  );
};
