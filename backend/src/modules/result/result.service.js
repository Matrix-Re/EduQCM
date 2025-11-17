import prisma from "../../config/db.js";

export const updateResultScore = async (resultId) => {
    if (!resultId) {
        throw new Error("resultId is required.");
    }

    // 1. Check the result exists
    const result = await prisma.result.findUnique({
        where: { ResultId: Number(resultId) }
    });
    if (!result) {
        throw new Error("Result not found.");
    }

    // 2. Retrieve all answers for this result
    const answers = await prisma.answer.findMany({
        where: { resultId: Number(resultId) }
    });

    if (answers.length === 0) {
        throw new Error("No answers found for this result.");
    }

    // 3. Retrieve the related proposals (correct ones)
    const proposalIds = answers.map(a => a.proposalId);

    const proposals = await prisma.proposal.findMany({
        where: { ProposalId: { in: proposalIds } }
    });

    // Compute correct answers
    let correct = 0;

    for (const answer of answers) {
        const proposal = proposals.find(p => p.ProposalId === answer.proposalId);

        if (!proposal) continue;

        // studentAnswer === proposal.isCorrect
        if (answer.studentAnswer === proposal.isCorrect) {
            correct++;
        }
    }

    const total = answers.length;

    // Score on 20
    const score = Number(((correct / total) * 20).toFixed(2));

    // 4. Update the Result entry
    return prisma.result.update({
        where: { ResultId: Number(resultId) },
        data: {
            score,
            completionDate: new Date()
        }
    });
};
