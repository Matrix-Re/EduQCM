import { describe, test, expect, jest, beforeEach } from "@jest/globals";
import prisma from "../src/config/db.js";

import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getAssignedQcmForStudent,
} from "../src/modules/user/user.service.js";

// Reset mocks before every test
beforeEach(() => jest.clearAllMocks());

describe("User Service", () => {

    // ========================================
    // getAllUsers
    // ========================================
    test("getAllUsers returns a list of users", async () => {

        prisma.user.findMany.mockResolvedValue([
            { UserId: 1, username: "john" },
            { UserId: 2, username: "marc" }
        ]);

        const result = await getAllUsers();

        expect(result.length).toBe(2);
        expect(prisma.user.findMany).toHaveBeenCalled();
    });

    // ========================================
    // getUserById
    // ========================================
    test("getUserById returns a user", async () => {

        prisma.user.findUnique.mockResolvedValue({
            UserId: 3,
            username: "student01"
        });

        const result = await getUserById(3);

        expect(result.UserId).toBe(3);
        expect(prisma.user.findUnique).toHaveBeenCalled();
    });

    test("getUserById throws if id missing", async () => {
        await expect(getUserById()).rejects.toThrow("userId is required.");
    });

    test("getUserById throws if user not found", async () => {

        prisma.user.findUnique.mockResolvedValue(null);

        await expect(getUserById(999))
            .rejects.toThrow("User not found.");
    });

    // ========================================
    // updateUser
    // ========================================
    test("updateUser successfully updates a user", async () => {

        prisma.user.findUnique.mockResolvedValue({ UserId: 5 });

        prisma.user.update.mockResolvedValue({
            UserId: 5,
            username: "updatedUser"
        });

        const result = await updateUser(5, {
            username: "updatedUser"
        });

        expect(result.username).toBe("updatedUser");
        expect(prisma.user.update).toHaveBeenCalled();
    });

    test("updateUser throws if id missing", async () => {
        await expect(updateUser(null, {}))
            .rejects.toThrow("userId is required.");
    });

    test("updateUser throws if user not found", async () => {

        prisma.user.findUnique.mockResolvedValue(null);

        await expect(updateUser(99, {}))
            .rejects.toThrow("User not found.");
    });

    // ========================================
    // deleteUser
    // ========================================
    test("deleteUser deletes a user and all dependencies", async () => {

        prisma.user.findUnique.mockResolvedValue({
            UserId: 7,
            username: "todelete"
        });

        prisma.student.deleteMany.mockResolvedValue({});
        prisma.teacher.deleteMany.mockResolvedValue({});
        prisma.result.deleteMany.mockResolvedValue({});

        prisma.user.delete.mockResolvedValue({
            UserId: 7
        });

        const result = await deleteUser(7);

        expect(result.UserId).toBe(7);
        expect(prisma.user.delete).toHaveBeenCalled();
    });

    test("deleteUser throws if id missing", async () => {
        await expect(deleteUser()).rejects.toThrow("userId is required.");
    });

    test("deleteUser throws if user not found", async () => {

        prisma.user.findUnique.mockResolvedValue(null);

        await expect(deleteUser(999))
            .rejects.toThrow("User not found.");
    });

    // ========================================
    // getAssignedQcmForStudent
    // ========================================
    test("getAssignedQcmForStudent returns QCM list", async () => {

        prisma.student.findUnique.mockResolvedValue({ UserId: 12 });

        prisma.result.findMany.mockResolvedValue([
            { ResultId: 1, qcmId: 5 },
            { ResultId: 2, qcmId: 8 }
        ]);

        const result = await getAssignedQcmForStudent(12);

        expect(result.length).toBe(2);
        expect(prisma.result.findMany).toHaveBeenCalled();
    });

    test("getAssignedQcmForStudent throws if studentId missing", async () => {
        await expect(getAssignedQcmForStudent())
            .rejects.toThrow("studentId is required.");
    });

    test("getAssignedQcmForStudent throws if student not found", async () => {

        prisma.student.findUnique.mockResolvedValue(null);

        await expect(getAssignedQcmForStudent(888))
            .rejects.toThrow("Student not found.");
    });

});
