import prisma from "../../config/db.js";

export const createTopic = async ({ description }) => {
    if (!description) throw new Error("description is required.");

    return prisma.topic.create({
        data: { description }
    });
};

export const getAllTopics = async () => {
    return prisma.topic.findMany();
};

export const getTopicById = async (id) => {
    if (!id) throw new Error("topicId is required.");

    const topic = await prisma.topic.findUnique({
        where: { TopicId: Number(id) }
    });

    if (!topic) throw new Error("Topic not found.");

    return topic;
};

export const deleteTopic = async (id) => {
    if (!id) throw new Error("topicId is required.");

    const topic = await prisma.topic.findUnique({
        where: { TopicId: Number(id) }
    });

    if (!topic) throw new Error("Topic not found.");

    return prisma.topic.delete({
        where: { TopicId: Number(id) }
    });
};

export const updateTopic = async (id, { description }) => {
    if (!id) throw new Error("topicId is required.");

    return prisma.topic.update({
        where: { TopicId: Number(id) },
        data: { description }
    });
};
