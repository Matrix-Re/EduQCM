import { describe, test, expect, jest, beforeEach } from "@jest/globals";

import {prisma} from "../../src/config/database.js";
import { hashPassword } from "../../src/utils/hash.js";
import { register, login } from "../../src/modules/auth/auth.service.js";

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
            id: 1,
            lastname: "Smith",
            firstname: "John",
            username: "jsmith"
        });

        // Mock: create Student entry
        prisma.student.create.mockResolvedValue({
            id: 1,
            completed_qcm_count: 0,
            average_qcm_score: 0
        });

        const result = await register(
            "Smith",
            "John",
            "jsmith",
            "mypassword",
            "student"
        );

        expect(result.username).toBe("jsmith");
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
            id: 1,
            username: "jsmith",
            password: hashed
        });

        // Second call: used to get user WITHOUT password
        prisma.user.findUnique.mockResolvedValueOnce({
            id: 1,
            lastName: "Smith",
            firstName: "John",
            username: "jsmith"
        });

        // Detect role
        prisma.student.findUnique.mockResolvedValue({ id: 1 });
        prisma.teacher.findUnique.mockResolvedValue(null);

        const result = await login("jsmith", "mypassword");

        expect(result.username).toBe("jsmith");
        expect(result.role).toBe("student");
        expect(result.access_token).toBeDefined();
    });

});
