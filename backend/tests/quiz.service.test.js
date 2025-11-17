import { describe, test, expect, jest, beforeEach } from "@jest/globals";

import prisma from "../src/config/db.js";

import {
    createQcm,
    getAllQcm,
    getQcmById,
    deleteQcm,
    updateQcm,
    assignQcmToStudent
} from "../src/modules/quiz/quiz.service.js";

// Reset all mocks before each test
beforeEach(() => jest.clearAllMocks());

describe("QCM Service", () => {

    // =====================================
    // CREATE QCM
    // =====================================
    test("createQcm creates a new QCM", async () => {

        // Teacher exists
        prisma.teacher.findUnique.mockResolvedValue({ UserId: 2 });

        // Topic exists
        prisma.topic.findUnique.mockResolvedValue({ TopicId: 1 });

        // QCM created
        prisma.qCM.create.mockResolvedValue({
            QCMId: 10,
            QCMLabel: "European Capitals Quiz",
            authorId: 2,
            topicId: 1
        });

        const result = await createQcm({
            qcmLabel: "European Capitals Quiz",
            authorId: 2,
            topicId: 1
        });

        expect(result.QCMId).toBe(10);
        expect(prisma.qCM.create).toHaveBeenCalled();
    });

    test("createQcm throws if teacher does not exist", async () => {

        prisma.teacher.findUnique.mockResolvedValue(null);

        await expect(
            createQcm({ qcmLabel: "Test", authorId: 3, topicId: 1 })
        ).rejects.toThrow("The specified teacher does not exist.");
    });

    test("createQcm throws if topic does not exist", async () => {

        prisma.teacher.findUnique.mockResolvedValue({ UserId: 3 });
        prisma.topic.findUnique.mockResolvedValue(null);

        await expect(
            createQcm({ qcmLabel: "Test", authorId: 3, topicId: 1 })
        ).rejects.toThrow("The specified topic does not exist.");
    });

    // =====================================
    // GET ALL QCM
    // =====================================
    test("getAllQcm returns a list of QCMs", async () => {

        prisma.qCM.findMany.mockResolvedValue([
            { QCMId: 1, QCMLabel: "Math Quiz" },
            { QCMId: 2, QCMLabel: "History Quiz" }
        ]);

        const result = await getAllQcm();

        expect(result.length).toBe(2);
        expect(prisma.qCM.findMany).toHaveBeenCalled();
    });

    // =====================================
    // GET QCM BY ID
    // =====================================
    test("getQcmById returns a QCM", async () => {

        prisma.qCM.findUnique.mockResolvedValue({
            QCMId: 5,
            QCMLabel: "Science Quiz",
            questions: []
        });

        const result = await getQcmById(5);

        expect(result.QCMId).toBe(5);
        expect(result.QCMLabel).toBe("Science Quiz");
    });

    test("getQcmById throws if id missing", async () => {
        await expect(getQcmById())
            .rejects.toThrow("qcmId is required.");
    });

    test("getQcmById throws if QCM not found", async () => {
        prisma.qCM.findUnique.mockResolvedValue(null);

        await expect(getQcmById(999))
            .rejects.toThrow("QCM not found.");
    });

    // =====================================
    // UPDATE QCM
    // =====================================
    test("updateQcm updates a QCM", async () => {

        prisma.qCM.findUnique.mockResolvedValue({ QCMId: 4 });

        prisma.qCM.update.mockResolvedValue({
            QCMId: 4,
            QCMLabel: "Updated QCM title",
            topicId: 1
        });

        const result = await updateQcm(4, {
            qcmLabel: "Updated QCM title",
            topicId: 1
        });

        expect(result.QCMId).toBe(4);
        expect(result.QCMLabel).toBe("Updated QCM title");
    });

    test("updateQcm throws if QCM does not exist", async () => {

        prisma.qCM.findUnique.mockResolvedValue(null);

        await expect(
            updateQcm(20, { qcmLabel: "Test" })
        ).rejects.toThrow("QCM not found.");
    });

    test("updateQcm throws if id missing", async () => {
        await expect(
            updateQcm(null, { qcmLabel: "Test" })
        ).rejects.toThrow("qcmId is required.");
    });

    // =====================================
    // DELETE QCM
    // =====================================
    test("deleteQcm deletes a QCM and its dependencies", async () => {

        prisma.qCM.findUnique.mockResolvedValue({ QCMId: 6 });

        prisma.proposal.deleteMany.mockResolvedValue({});
        prisma.question.deleteMany.mockResolvedValue({});
        prisma.qCM.delete.mockResolvedValue({
            QCMId: 6,
            QCMLabel: "Deleted Quiz"
        });

        const result = await deleteQcm(6);

        expect(result.QCMId).toBe(6);
        expect(prisma.qCM.delete).toHaveBeenCalled();
    });

    test("deleteQcm throws if QCM does not exist", async () => {

        prisma.qCM.findUnique.mockResolvedValue(null);

        await expect(deleteQcm(999))
            .rejects.toThrow("QCM not found.");
    });

    // =====================================
    // ASSIGN QCM TO STUDENT
    // =====================================
    test("assignQcmToStudent creates a result entry", async () => {

        prisma.qCM.findUnique.mockResolvedValue({ QCMId: 8 });

        prisma.student.findUnique.mockResolvedValue({ UserId: 15 });

        prisma.result.create.mockResolvedValue({
            ResultId: 77,
            qcmId: 8,
            userId: 15
        });

        const result = await assignQcmToStudent(8, 15);

        expect(result.ResultId).toBe(77);
        expect(prisma.result.create).toHaveBeenCalled();
    });

    test("assignQcmToStudent throws if QCM not found", async () => {
        prisma.qCM.findUnique.mockResolvedValue(null);

        await expect(assignQcmToStudent(5, 10))
            .rejects.toThrow("QCM not found.");
    });

    test("assignQcmToStudent throws if student not found", async () => {

        prisma.qCM.findUnique.mockResolvedValue({ QCMId: 10 });
        prisma.student.findUnique.mockResolvedValue(null);

        await expect(assignQcmToStudent(10, 999))
            .rejects.toThrow("Student not found.");
    });

});
