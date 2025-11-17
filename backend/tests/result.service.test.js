import { describe, test, expect, jest, beforeEach } from "@jest/globals";
import prisma from "../src/config/db.js";

import { updateResultScore } from "../src/modules/result/result.service.js";

// Reset mocks before each test
beforeEach(() => jest.clearAllMocks());

describe("Result Service", () => {

    // ================================================
    // SUCCESS CASE — SCORE CALCULATED
    // ================================================
    test("updateResultScore calculates and updates score correctly", async () => {

        // Step 1: result exists
        prisma.result.findUnique.mockResolvedValue({
            ResultId: 10,
            qcmId: 5,
            userId: 3
        });

        // Step 2: answers
        prisma.answer.findMany.mockResolvedValue([
            { resultId: 10, proposalId: 1, studentAnswer: true },
            { resultId: 10, proposalId: 2, studentAnswer: false },
            { resultId: 10, proposalId: 3, studentAnswer: true },
            { resultId: 10, proposalId: 4, studentAnswer: true }
        ]);

        // Step 3: proposals with correct answers
        prisma.proposal.findMany.mockResolvedValue([
            { ProposalId: 1, isCorrect: true },
            { ProposalId: 2, isCorrect: true },
            { ProposalId: 3, isCorrect: false },
            { ProposalId: 4, isCorrect: true }
        ]);

        // 4 answers → 2 correct:
        // - proposalId 1: correct
        // - proposalId 2: wrong
        // - proposalId 3: wrong
        // - proposalId 4: correct
        //
        // correct = 2 / 4 = 0.5 → score = 10

        prisma.result.update.mockResolvedValue({
            ResultId: 10,
            score: 10,
            completionDate: new Date()
        });

        const result = await updateResultScore(10);

        expect(result.score).toBe(10);
        expect(prisma.result.update).toHaveBeenCalled();
    });

    // ================================================
    // MISSING ID
    // ================================================
    test("updateResultScore throws if resultId missing", async () => {
        await expect(updateResultScore())
            .rejects.toThrow("resultId is required.");
    });

    // ================================================
    // RESULT NOT FOUND
    // ================================================
    test("updateResultScore throws if result not found", async () => {

        prisma.result.findUnique.mockResolvedValue(null);

        await expect(updateResultScore(999))
            .rejects.toThrow("Result not found.");
    });

    // ================================================
    // NO ANSWERS FOUND
    // ================================================
    test("updateResultScore throws if no answers found", async () => {

        prisma.result.findUnique.mockResolvedValue({ ResultId: 33 });
        prisma.answer.findMany.mockResolvedValue([]);

        await expect(updateResultScore(33))
            .rejects.toThrow("No answers found for this result.");
    });

    // ================================================
    // ENSURE CORRECT PROPOSAL LOOKUP
    // ================================================
    test("updateResultScore handles mixed correct/incorrect answers", async () => {

        prisma.result.findUnique.mockResolvedValue({ ResultId: 20 });

        prisma.answer.findMany.mockResolvedValue([
            { resultId: 20, proposalId: 10, studentAnswer: true },
            { resultId: 20, proposalId: 11, studentAnswer: false }
        ]);

        prisma.proposal.findMany.mockResolvedValue([
            { ProposalId: 10, isCorrect: false }, // wrong
            { ProposalId: 11, isCorrect: false } // correct
        ]);

        // correct = 1 / 2 → score = 10

        prisma.result.update.mockResolvedValue({
            ResultId: 20,
            score: 10,
            completionDate: new Date()
        });

        const result = await updateResultScore(20);

        expect(result.score).toBe(10);
    });

});
