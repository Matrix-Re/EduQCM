import prisma from "../../config/db.js";

export const submitAnswer = async ({ resultId, proposalId, studentAnswer }) => {
    if (!resultId || !proposalId || studentAnswer === undefined) {
        throw new Error("resultId, proposalId and studentAnswer are required.");
    }

    // 1. Verify result exists (resultId = QCM assigned to a student)
    const result = await prisma.result.findUnique({
        where: { ResultId: Number(resultId) }
    });
    if (!result) {
        throw new Error("Result not found.");
    }

    // 2. Verify proposal exists
    const proposal = await prisma.proposal.findUnique({
        where: { ProposalId: Number(proposalId) }
    });
    if (!proposal) {
        throw new Error("Proposal not found.");
    }

    // 3. Insert or update the answer (avoid duplicates)
    return prisma.answer.upsert({
        where: {
            resultId_proposalId: {
                resultId: Number(resultId),
                proposalId: Number(proposalId)
            }
        },
        update: {
            studentAnswer: studentAnswer
        },
        create: {
            resultId: Number(resultId),
            proposalId: Number(proposalId),
            studentAnswer: studentAnswer
        }
    });
};
