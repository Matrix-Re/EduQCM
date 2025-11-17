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

        this.qCM = {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        };

        this.question = {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            deleteMany: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
        };

        this.proposal = {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            deleteMany: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
        };

        this.topic = {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };

        this.result = {
            create: jest.fn(),
            update: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            delete: jest.fn(),
            deleteMany: jest.fn(),
        };

        this.answer = {
            upsert: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
        };

    }
}

export const PrismaClient = PrismaClientMock;
