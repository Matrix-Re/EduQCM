import { describe, test, expect, jest, beforeEach } from "@jest/globals";
import prisma from "../src/config/db.js";

import { submitAnswer } from "../src/modules/answer/answer.service.js";

// Reset all mocks before each test
beforeEach(() => jest.clearAllMocks());

describe("Answer Service", () => {

    // ================================================
    // CREATE OR UPDATE ANSWER
    // ================================================
    test("submitAnswer inserts a new answer", async () => {

        // Mock result exists
        prisma.result.findUnique.mockResolvedValue({
            ResultId: 10,
            qcmId: 3,
            userId: 5
        });

        // Mock proposal exists
        prisma.proposal.findUnique.mockResolvedValue({
            ProposalId: 22,
            questionId: 7
        });

        // Mock upsert
        prisma.answer.upsert.mockResolvedValue({
            resultId: 10,
            proposalId: 22,
            studentAnswer: true
        });

        const result = await submitAnswer({
            resultId: 10,
            proposalId: 22,
            studentAnswer: true
        });

        expect(result.resultId).toBe(10);
        expect(result.proposalId).toBe(22);
        expect(result.studentAnswer).toBe(true);
        expect(prisma.answer.upsert).toHaveBeenCalled();
    });

    // ================================================
    // VALIDATION ERRORS
    // ================================================
    test("submitAnswer throws if fields are missing", async () => {
        await expect(submitAnswer({}))
            .rejects.toThrow("resultId, proposalId and studentAnswer are required.");
    });

    // ================================================
    // RESULT NOT FOUND
    // ================================================
    test("submitAnswer throws if result does not exist", async () => {

        prisma.result.findUnique.mockResolvedValue(null);

        await expect(submitAnswer({
            resultId: 99,
            proposalId: 10,
            studentAnswer: true
        })).rejects.toThrow("Result not found.");
    });

    // ================================================
    // PROPOSAL NOT FOUND
    // ================================================
    test("submitAnswer throws if proposal does not exist", async () => {

        prisma.result.findUnique.mockResolvedValue({ ResultId: 5 });
        prisma.proposal.findUnique.mockResolvedValue(null);

        await expect(submitAnswer({
            resultId: 5,
            proposalId: 777,
            studentAnswer: false
        })).rejects.toThrow("Proposal not found.");
    });

    // ================================================
    // UPSERT WORKS FOR UPDATE
    // ================================================
    test("submitAnswer updates an existing answer (upsert)", async () => {

        prisma.result.findUnique.mockResolvedValue({ ResultId: 30 });
        prisma.proposal.findUnique.mockResolvedValue({ ProposalId: 11 });

        prisma.answer.upsert.mockResolvedValue({
            resultId: 30,
            proposalId: 11,
            studentAnswer: false
        });

        const result = await submitAnswer({
            resultId: 30,
            proposalId: 11,
            studentAnswer: false
        });

        expect(result.studentAnswer).toBe(false);
        expect(prisma.answer.upsert).toHaveBeenCalled();
    });

});
