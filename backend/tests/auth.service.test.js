import { describe, test, expect, jest, beforeEach } from "@jest/globals";

import prisma from "../src/config/db.js";
import { hashPassword } from "../src/utils/hash.js";
import { registerUser, loginUser } from "../src/modules/auth/auth.service.js";

// Reset mocks before each test
beforeEach(() => jest.clearAllMocks());

describe("Auth Service", () => {

    // =============================
    // REGISTER USER
    // =============================
    test("registerUser successfully creates a new user", async () => {

        // Mock: username does NOT already exist
        prisma.user.findUnique.mockResolvedValue(null);

        // Mock: create user
        prisma.user.create.mockResolvedValue({
            UserId: 1,
            lastName: "Smith",
            firstName: "John",
            username: "jsmith"
        });

        // Mock: create Student entry
        prisma.student.create.mockResolvedValue({
            UserId: 1,
            completedQCMCount: 0,
            averageQCMScore: 0
        });

        const result = await registerUser({
            lastName: "Smith",
            firstName: "John",
            username: "jsmith",
            password: "mypassword",
            role: "student"
        });

        expect(result.user.username).toBe("jsmith");
        expect(result.role).toBe("student");
        expect(prisma.user.create).toHaveBeenCalled();
        expect(prisma.student.create).toHaveBeenCalled();
    });

    // =============================
    // LOGIN USER
    // =============================
    test("loginUser succeeds with correct password", async () => {

        const hashed = await hashPassword("mypassword");

        // First call: used to check password
        prisma.user.findUnique.mockResolvedValueOnce({
            UserId: 1,
            username: "jsmith",
            password: hashed
        });

        // Second call: used to get user WITHOUT password
        prisma.user.findUnique.mockResolvedValueOnce({
            UserId: 1,
            lastName: "Smith",
            firstName: "John",
            username: "jsmith"
        });

        // Detect role
        prisma.student.findUnique.mockResolvedValue({ UserId: 1 });
        prisma.teacher.findUnique.mockResolvedValue(null);

        const result = await loginUser("jsmith", "mypassword");

        expect(result.user.username).toBe("jsmith");
        expect(result.role).toBe("student");
        expect(result.token).toBeDefined();
    });

});
