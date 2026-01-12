import { prisma } from "../../config/database.js";
import { apiError } from "../../utils/error.js";
import { mapQuestion } from "../../mappers/question.mapper.js";

/**
 * Create a new question inside a QCM
 */
export const createQuestion = async ({ label, qcm_id }) => {
  if (!label || !qcm_id) {
    throw new apiError(400, "label and qcm_id are required.");
  }

  return mapQuestion(
    await prisma.question.create({
      data: {
        label,
        qcm_id: Number(qcm_id),
      },
    })
  );
};

/**
 * Update an existing question
 */
export const modifyQuestion = async (id, { label }) => {
  if (!id) {
    throw new apiError(400, "The question id is required.");
  }

  if (Number.isNaN(Number(id))) {
    throw new apiError(400, "id must be a valid number.");
  }

  // Check if the proposal exist
  const question = await prisma.question.findUnique({
    where: { id: Number(id) },
  });
  if (!question) {
    throw new apiError(404, "The specified question does not exist.");
  }

  return mapQuestion(
    await prisma.question.update({
      where: { id: Number(id) },
      data: {
        label: label ?? undefined,
      },
    })
  );
};

/**
 * Delete a question and its associated proposals
 */
export const removeQuestion = async (id_param) => {
  if (!id_param) {
    throw new apiError(400, "id is required.");
  }

  if (Number.isNaN(Number(id_param))) {
    throw new apiError(400, "id must be a valid number.");
  }

  const id = Number(id_param);

  // Check if the question exists
  const question = await prisma.question.findUnique({
    where: { id: id },
  });

  if (!question) {
    throw new apiError(404, "Question not found.");
  }

  // Delete all proposals linked to the question
  await prisma.proposal.deleteMany({
    where: { question_id: id },
  });

  // Delete the question
  return mapQuestion(
    await prisma.question.delete({
      where: { id: id },
    })
  );
};

/**
 * Retrieve a question by its ID (with proposals)
 */
export const getQuestion = async (id) => {
  if (!id) {
    throw new apiError(400, "The question id is required.");
  }

  if (Number.isNaN(Number(id))) {
    throw new apiError(400, "id must be a valid number.");
  }

  const question = await prisma.question.findUnique({
    where: { id: Number(id) },
    include: {
      proposals: true, // proposal → proposals (correct prisma naming)
    },
  });

  if (!question) {
    throw new apiError(404, "Question not found.");
  }

  return mapQuestion(question);
};
