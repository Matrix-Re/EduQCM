import { jest } from "@jest/globals";

class PrismaClientMock {
    constructor() {
        this.user = {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            deleteMany: jest.fn(),
        };

        this.student = {
            create: jest.fn(),
            findUnique: jest.fn(),
            delete: jest.fn(),
            deleteMany: jest.fn(),
        };

        this.teacher = {
            create: jest.fn(),
            findUnique: jest.fn(),
            delete: jest.fn(),
            deleteMany: jest.fn(),
        };

    }
}

export const PrismaClient = PrismaClientMock;
