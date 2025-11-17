import { describe, test, expect, jest, beforeEach } from "@jest/globals";
import prisma from "../src/config/db.js";

import {
    createTopic,
    getAllTopics,
    getTopicById,
    deleteTopic,
    updateTopic
} from "../src/modules/topic/topic.service.js";

// Reset mocks for each test
beforeEach(() => jest.clearAllMocks());

describe("Topic Service", () => {

    // =====================================
    // CREATE TOPIC
    // =====================================
    test("createTopic creates a new topic", async () => {

        prisma.topic.create.mockResolvedValue({
            TopicId: 1,
            description: "Mathematics"
        });

        const result = await createTopic({ description: "Mathematics" });

        expect(result.TopicId).toBe(1);
        expect(result.description).toBe("Mathematics");
        expect(prisma.topic.create).toHaveBeenCalled();
    });

    test("createTopic throws if description missing", async () => {
        await expect(
            createTopic({})
        ).rejects.toThrow("description is required.");
    });

    // =====================================
    // GET ALL TOPICS
    // =====================================
    test("getAllTopics returns a list of topics", async () => {

        prisma.topic.findMany.mockResolvedValue([
            { TopicId: 1, description: "Math" },
            { TopicId: 2, description: "Physics" }
        ]);

        const result = await getAllTopics();

        expect(result.length).toBe(2);
        expect(prisma.topic.findMany).toHaveBeenCalled();
    });

    // =====================================
    // GET TOPIC BY ID
    // =====================================
    test("getTopicById returns a topic", async () => {

        prisma.topic.findUnique.mockResolvedValue({
            TopicId: 5,
            description: "Biology"
        });

        const result = await getTopicById(5);

        expect(result.TopicId).toBe(5);
        expect(result.description).toBe("Biology");
    });

    test("getTopicById throws if id missing", async () => {
        await expect(
            getTopicById()
        ).rejects.toThrow("topicId is required.");
    });

    test("getTopicById throws if topic not found", async () => {

        prisma.topic.findUnique.mockResolvedValue(null);

        await expect(
            getTopicById(999)
        ).rejects.toThrow("Topic not found.");
    });

    // =====================================
    // UPDATE TOPIC
    // =====================================
    test("updateTopic updates a topic", async () => {

        prisma.topic.update.mockResolvedValue({
            TopicId: 3,
            description: "Computer Science"
        });

        const result = await updateTopic(3, { description: "Computer Science" });

        expect(result.TopicId).toBe(3);
        expect(result.description).toBe("Computer Science");
        expect(prisma.topic.update).toHaveBeenCalled();
    });

    test("updateTopic throws if id missing", async () => {
        await expect(
            updateTopic(null, { description: "Math" })
        ).rejects.toThrow("topicId is required.");
    });

    // =====================================
    // DELETE TOPIC
    // =====================================
    test("deleteTopic removes a topic", async () => {

        // mock topic existence
        prisma.topic.findUnique.mockResolvedValue({ TopicId: 9 });

        prisma.topic.delete.mockResolvedValue({
            TopicId: 9,
            description: "History"
        });

        const result = await deleteTopic(9);

        expect(result.TopicId).toBe(9);
        expect(prisma.topic.delete).toHaveBeenCalled();
    });

    test("deleteTopic throws if topic not found", async () => {

        prisma.topic.findUnique.mockResolvedValue(null);

        await expect(
            deleteTopic(999)
        ).rejects.toThrow("Topic not found.");
    });

    test("deleteTopic throws if id missing", async () => {
        await expect(
            deleteTopic()
        ).rejects.toThrow("topicId is required.");
    });

});
