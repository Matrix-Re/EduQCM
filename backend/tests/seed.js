import jwt from "jsonwebtoken";
import { prisma } from "../src/config/database.js";

// Helper to generate unique strings
export const uniq = (prefix = "u") => `${prefix}_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

const tokenFor = (id, role = "student") =>
    jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1h" });

// Arrays to track created entities for cleanup
export const createdUserIds = [];
export const createdTopicLabels = [];
export const createdQcmIds = [];
export const createdResultIds = [];

// Function to create a user (student or teacher)
export const seedUser = async (role = "teacher") => {
  const username = uniq(role);

  const user = await prisma.user.create({
    data: {
      lastname: "TEST",
      firstname: "USER",
      username,
      password: "hashed_password_for_tests",
      ...(role === "student"
        ? { student: { create: {} } }
        : { teacher: { create: {} } }),
    },
    include: { student: true, teacher: true },
  });

  // Register the user ID for future cleanup
  createdUserIds.push(user.id);

  return {
    user,
    token: tokenFor(user.id, role),
    role,
  };
};

// Function to create a Topic
export const seedTopic = async () => {
  const topic = await prisma.topic.create({
    data: {
      label: uniq("Topic Label"),
    },
  });

  // Register the Topic label for future cleanup
  createdTopicLabels.push(topic.label);

  return topic;
};

// Function to create a QCM
export const seedQcm = async () => {
  const viewer = await seedUser("teacher");
  const topic = await seedTopic();

  const qcm = await prisma.qcm.create({
    data: {
      label: uniq("Title"),
      author_id: viewer.user.id,
      topic_id: topic.id,
    },
  });

  // Register the QCM ID for future cleanup
  createdQcmIds.push(qcm.id);

  return qcm;
};

export const seedResult = async (qcmId, studentId) => {
  const result = await prisma.result.create({
    data: {
      qcm_id: qcmId,
      student_id: studentId,
      assignment_date: new Date(),
      completion_date: null,
      score: null,
    },
  });

  // Register the Result ID for future cleanup
  createdResultIds.push(result.id);

  return result;
};

// Function to cleanup and delete all created entities
export const cleanup = async () => {
  try {
    // Delete created Results
    if (createdResultIds.length) {
      await prisma.result.deleteMany({
        where: { id: { in: createdResultIds } },
      });
    }
    
    // Delete created QCMs
    if (createdQcmIds.length) {
      await prisma.qcm.deleteMany({
        where: { id: { in: createdQcmIds } },
      });
    }

    // Delete created Topics
    if (createdTopicLabels.length) {
      await prisma.topic.deleteMany({
        where: { label: { in: createdTopicLabels } },
      });
    }

    // Delete created users (students and teachers)
    if (createdUserIds.length) {
      await prisma.student.deleteMany({
        where: { id: { in: createdUserIds } },
      });
      await prisma.teacher.deleteMany({
        where: { id: { in: createdUserIds } },
      });
      await prisma.user.deleteMany({
        where: { id: { in: createdUserIds } },
      });
    }
  } catch (error) {
    console.error("Error during cleanup:", error);
  } finally {
    // Reset arrays after cleanup
    createdUserIds.length = 0;
    createdTopicLabels.length = 0;
    createdQcmIds.length = 0;
    createdResultIds.length = 0;
  }
};

