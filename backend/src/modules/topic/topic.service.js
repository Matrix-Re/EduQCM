import { prisma } from "../../config/database.js";
import { mapTopic } from "../../mappers/topic.mapper.js";
import { throwError } from "../../utils/error.js";

/*
 * Create a new Topic
 */
export const createTopic = async ({ label }) => {
  if (!label || typeof label !== "string" || !label.trim()) {
    throwError(400, "FIELD_MISSING");
  }

  return mapTopic(
    await prisma.topic.create({
      data: { label: label.trim() },
    })
  );
};

/*
 * Retrieve all Topics
 */
export const getAllTopics = async () => {
  const topics = await prisma.topic.findMany({
    orderBy: { id: "asc" },
  });

  return topics.map((topic) => mapTopic(topic));
};

/*
 * Retrieve a single Topic by ID
 */
export const getTopicById = async (id) => {
  if (!id) throwError(400, "FIELD_MISSING");

  const topicId = Number(id);
  if (Number.isNaN(topicId))
    throwError(400, "PARAMETERS_MUST_BE_VALID_NUMBERS");

  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
  });

  if (!topic) throwError(404, "TOPIC_NOT_FOUND");

  return mapTopic(topic);
};

/*
 * Update a Topic
 */
export const updateTopic = async (id, { label }) => {
  if (!id) throwError(400, "FIELD_MISSING");

  const topicId = Number(id);
  if (Number.isNaN(topicId))
    throwError(400, "PARAMETERS_MUST_BE_VALID_NUMBERS");

  if (label !== undefined) {
    if (typeof label !== "string" || !label.trim()) {
      throwError(400, "INVALID_LABEL");
    }
  }

  const existing = await prisma.topic.findUnique({
    where: { id: topicId },
  });
  if (!existing) throwError(404, "TOPIC_NOT_FOUND");

  return mapTopic(
    await prisma.topic.update({
      where: { id: topicId },
      data: {
        label: label !== undefined ? label.trim() : undefined,
      },
    })
  );
};

/*
 * Delete a Topic
 */
export const deleteTopic = async (id) => {
  if (!id) throwError(400, "FIELD_MISSING");

  const topicId = Number(id);
  if (Number.isNaN(topicId))
    throwError(400, "PARAMETERS_MUST_BE_VALID_NUMBERS");

  const existing = await prisma.topic.findUnique({
    where: { id: topicId },
  });
  if (!existing) throwError(404, "TOPIC_NOT_FOUND");

  return mapTopic(
    await prisma.topic.delete({
      where: { id: topicId },
    })
  );
};
