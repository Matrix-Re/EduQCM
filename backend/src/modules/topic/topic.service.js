import { prisma } from "../../config/database.js";
import { mapTopic } from "../../mappers/topic.mapper.js";
import { throwError } from "../../utils/error.js";

/*
 * Create a new Topic
 */
export const createTopic = async ({ label }) => {
  if (!label || typeof label !== "string" || !label.trim()) {
    throwError(400, "Label is required.");
  }

  return mapTopic(await prisma.topic.create({
    data: { label: label.trim() },
  }));
};

/*
 * Retrieve all Topics
 */
export const getAllTopics = async () => {
  const topics = await prisma.topic.findMany({
    orderBy: { id: "asc" },
  });

  return topics.map(topic => mapTopic(topic));
};

/*
 * Retrieve a single Topic by ID
 */
export const getTopicById = async (id) => {
  if (!id) throwError(400, "Topic ID is required.");

  const topicId = Number(id);
  if (Number.isNaN(topicId)) throwError(400, "Topic ID must be a number.");

  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
  });

  if (!topic) throwError(404, "Topic not found.");

  return mapTopic(topic);
};

/*
 * Update a Topic
 */
export const updateTopic = async (id, { label }) => {
  if (!id) throwError(400, "Topic ID is required.");

  const topicId = Number(id);
  if (Number.isNaN(topicId)) throwError(400, "Topic ID must be a number.");

  if (label !== undefined) {
    if (typeof label !== "string" || !label.trim()) {
      throwError(400, "label must be a non-empty string.");
    }
  }

  const existing = await prisma.topic.findUnique({
    where: { id: topicId },
  });
  if (!existing) throwError(404, "Topic not found.");

  return mapTopic(await prisma.topic.update({
    where: { id: topicId },
    data: {
      label: label !== undefined ? label.trim() : undefined,
    },
  }));
};

/*
 * Delete a Topic
 */
export const deleteTopic = async (id) => {
  if (!id) throwError(400, "Topic ID is required.");

  const topicId = Number(id);
  if (Number.isNaN(topicId)) throwError(400, "Topic ID must be a number.");

  const existing = await prisma.topic.findUnique({
    where: { id: topicId },
  });
  if (!existing) throwError(404, "Topic not found.");

  return mapTopic(await prisma.topic.delete({
    where: { id: topicId },
  }));
};
