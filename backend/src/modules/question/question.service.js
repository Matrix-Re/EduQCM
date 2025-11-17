import prisma from "../../config/db.js";

/**
 * Create a new question inside a QCM
 */
export const createQuestion = async ({ questionLabel, questionTime, qcmId }) => {
    if (!questionLabel || !qcmId) {
        throw new Error("questionLabel and qcmId are required.");
    }

    return prisma.question.create({
        data: {
            questionLabel,
            questionTime: questionTime ?? null,
            qcmId: Number(qcmId)
        }
    });
};

/**
 * Update an existing question
 */
export const modifyQuestion = async (questionId, { questionLabel, questionTime }) => {
    if (!questionId) {
        throw new Error("questionId is required.");
    }

    // Check if the proposal exist
    const question = await prisma.question.findUnique({
        where: { QuestionId: Number(questionId) }
    });
    if (!question){
        throw new Error("The specified question does not exist.");
    }

    return prisma.question.update({
        where: { QuestionId: Number(questionId) },
        data: {
            questionLabel: questionLabel ?? undefined,
            questionTime: questionTime ?? undefined
        }
    });
};

/**
 * Delete a question and its associated proposals
 */
export const removeQuestion = async (questionId) => {
    if (!questionId) {
        throw new Error("questionId is required.");
    }

    const id = Number(questionId);

    // Check if the question exists
    const question = await prisma.question.findUnique({
        where: { QuestionId: id }
    });

    if (!question) {
        throw new Error("Question not found.");
    }

    // Delete all proposals linked to the question
    await prisma.proposal.deleteMany({
        where: { questionId: id }
    });

    // Delete the question
    return prisma.question.delete({
        where: { QuestionId: id }
    });
};

/**
 * Retrieve a question by its ID (with proposals)
 */
export const getQuestion = async (questionId) => {
    if (!questionId) {
        throw new Error("questionId is required.");
    }

    const question = await prisma.question.findUnique({
        where: { QuestionId: Number(questionId) },
        include: {
            proposals: true   // proposal → proposals (correct prisma naming)
        }
    });

    if (!question) {
        throw new Error("Question not found.");
    }

    return question;
};
