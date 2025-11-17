import prisma from "../../config/db.js";

/**
 * Create a proposal for a question
 */
export const createProposal = async ({ proposalLabel, isCorrect, questionId }) => {
    if (!proposalLabel || isCorrect === undefined || !questionId) {
        throw new Error("proposalLabel, isCorrect and questionId are required.");
    }

    // Check that the question exists
    const question = await prisma.question.findUnique({
        where: { QuestionId: Number(questionId) }
    });

    if (!question) {
        throw new Error("The specified question does not exist.");
    }

    // Create proposal
    return prisma.proposal.create({
        data: {
            proposalLabel,
            isCorrect,
            questionId: Number(questionId),
        }
    });
};

/**
 * Modify a proposal
 */
export const modifyProposal = async (proposalId, { proposalLabel, isCorrect }) => {
    if (!proposalId) {
        throw new Error("proposalId is required.");
    }

    // Check if the proposal exist
    const proposal = await prisma.proposal.findUnique({
        where: { ProposalId: Number(proposalId) }
    });
    if (!proposal){
        throw new Error("The specified proposal does not exist.");
    }

    return prisma.proposal.update({
        where: { ProposalId: Number(proposalId) },
        data: {
            proposalLabel: proposalLabel ?? undefined,
            isCorrect: isCorrect ?? undefined
        }
    });
};

/**
 * Delete a proposal
 */
export const removeProposal = async (proposalId) => {
    if (!proposalId) {
        throw new Error("proposalId is required.");
    }

    return prisma.proposal.delete({
        where: { ProposalId: Number(proposalId) }
    });
};
