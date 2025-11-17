import { describe, test, expect, jest, beforeEach } from "@jest/globals";
import prisma from "../src/config/db.js";

import {
    createProposal,
    modifyProposal,
    removeProposal
} from "../src/modules/proposal/proposal.service.js";

// Reset all mocks before each test
beforeEach(() => jest.clearAllMocks());

describe("Proposal Service", () => {

    // ==========================================
    // CREATE PROPOSAL
    // ==========================================
    test("createProposal creates a new proposal", async () => {

        // Mock: Question exists
        prisma.question.findUnique.mockResolvedValue({
            QuestionId: 10,
            questionLabel: "What is the capital of France?"
        });

        // Mock: Proposal creation
        prisma.proposal.create.mockResolvedValue({
            ProposalId: 5,
            proposalLabel: "Paris",
            isCorrect: true,
            questionId: 10
        });

        const result = await createProposal({
            proposalLabel: "Paris",
            isCorrect: true,
            questionId: 10
        });

        expect(result.ProposalId).toBe(5);
        expect(prisma.proposal.create).toHaveBeenCalled();
    });

    test("createProposal throws error if required fields are missing", async () => {
        await expect(
            createProposal({ proposalLabel: "Paris" })
        ).rejects.toThrow("proposalLabel, isCorrect and questionId are required.");
    });

    test("createProposal throws error if question does not exist", async () => {

        prisma.question.findUnique.mockResolvedValue(null);

        await expect(
            createProposal({
                proposalLabel: "Paris",
                isCorrect: true,
                questionId: 999
            })
        ).rejects.toThrow("The specified question does not exist.");
    });

    // ==========================================
    // MODIFY PROPOSAL
    // ==========================================
    test("modifyProposal updates an existing proposal", async () => {

        prisma.proposal.findUnique.mockResolvedValue({
            ProposalId: 4,
            proposalLabel: "Paris",
            isCorrect: false
        });

        prisma.proposal.update.mockResolvedValue({
            ProposalId: 4,
            proposalLabel: "Lyon",
            isCorrect: false
        });

        const result = await modifyProposal(4, {
            proposalLabel: "Lyon",
            isCorrect: false
        });

        expect(result.ProposalId).toBe(4);
        expect(prisma.proposal.update).toHaveBeenCalled();
    });

    test("modifyProposal throws error if proposalId missing", async () => {
        await expect(
            modifyProposal(null, { proposalLabel: "Paris" })
        ).rejects.toThrow("proposalId is required.");
    });

    // ==========================================
    // REMOVE PROPOSAL
    // ==========================================
    test("removeProposal deletes a proposal", async () => {

        prisma.proposal.delete.mockResolvedValue({
            ProposalId: 7,
            proposalLabel: "Marseille"
        });

        const result = await removeProposal(7);

        expect(result.ProposalId).toBe(7);
        expect(prisma.proposal.delete).toHaveBeenCalled();
    });

    test("removeProposal throws error if proposalId missing", async () => {
        await expect(removeProposal(null))
            .rejects.toThrow("proposalId is required.");
    });
});
