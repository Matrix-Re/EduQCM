import { describe, test, expect, jest, beforeEach } from "@jest/globals";

import prisma from "../src/config/db.js";
import {
    createQuestion,
    modifyQuestion,
    removeQuestion,
    getQuestion
} from "../src/modules/question/question.service.js";

// Reset mocks before each test
beforeEach(() => jest.clearAllMocks());

describe("Question Service", () => {

    // ======================================
    // CREATE QUESTION
    // ======================================
    test("createQuestion creates a new question", async () => {

        prisma.question.create.mockResolvedValue({
            QuestionId: 1,
            questionLabel: "What is the capital of France?",
            questionTime: 30,
            qcmId: 2
        });

        const result = await createQuestion({
            questionLabel: "What is the capital of France?",
            questionTime: 30,
            qcmId: 2
        });

        expect(result.QuestionId).toBe(1);
        expect(prisma.question.create).toHaveBeenCalled();
    });

    test("createQuestion throws an error if required fields are missing", async () => {
        await expect(
            createQuestion({ qcmId: 2 })
        ).rejects.toThrow("questionLabel and qcmId are required.");
    });

    // ======================================
    // MODIFY QUESTION
    // ======================================
    test("modifyQuestion updates an existing question", async () => {

        prisma.question.findUnique.mockResolvedValue({
            QuestionId: 5,
            questionLabel: "old label",
            questionTime: 45
        });

        prisma.question.update.mockResolvedValue({
            QuestionId: 5,
            questionLabel: "Updated label",
            questionTime: 45
        });

        const result = await modifyQuestion(5, {
            questionLabel: "Updated label",
            questionTime: 45
        });

        expect(result.QuestionId).toBe(5);
        expect(prisma.question.update).toHaveBeenCalled();
    });

    test("modifyQuestion throws an error if questionId is missing", async () => {
        await expect(
            modifyQuestion(null, { questionLabel: "Test" })
        ).rejects.toThrow("questionId is required.");
    });

    // ======================================
    // REMOVE QUESTION
    // ======================================
    test("removeQuestion deletes a question and its proposals", async () => {

        // Mock: question exists
        prisma.question.findUnique.mockResolvedValue({
            QuestionId: 10
        });

        prisma.proposal.deleteMany.mockResolvedValue({});
        prisma.question.delete.mockResolvedValue({
            QuestionId: 10,
            questionLabel: "Deleted"
        });

        const result = await removeQuestion(10);

        expect(result.QuestionId).toBe(10);
        expect(prisma.proposal.deleteMany).toHaveBeenCalled();
        expect(prisma.question.delete).toHaveBeenCalled();
    });

    test("removeQuestion throws error if question does not exist", async () => {
        prisma.question.findUnique.mockResolvedValue(null);

        await expect(removeQuestion(99))
            .rejects.toThrow("Question not found.");
    });

    // ======================================
    // GET QUESTION
    // ======================================
    test("getQuestion returns a question with its proposals", async () => {

        prisma.question.findUnique.mockResolvedValue({
            QuestionId: 2,
            questionLabel: "Test",
            questionTime: 30,
            proposals: [
                { ProposalId: 1, proposalLabel: "Paris", isCorrect: true }
            ]
        });

        const result = await getQuestion(2);

        expect(result.QuestionId).toBe(2);
        expect(result.proposals.length).toBe(1);
    });

    test("getQuestion throws error if id is missing", async () => {
        await expect(getQuestion())
            .rejects.toThrow("questionId is required.");
    });

});
