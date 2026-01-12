import { prisma } from "../../config/database.js";
import { apiError } from "../../utils/error.js";
import { mapUser } from "../../mappers/user.mapper.js";
import { mapAssignedQcm } from "../../mappers/assignement.mapper.js";

/**
 * Retrieve all users
 */
export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    include: {
      student: true,
      teacher: true,
    },
  });

  return users.map((user) => {
    return mapUser(user);
  });
};

/**
 * Retrieve a single user by ID
 */
export const getUserById = async (userId) => {
  if (!userId) throw apiError(400, "User id is required");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      student: true,
      teacher: true,
    },
  });

  if (!user) throw apiError(404, "User not found");

  return mapUser(user);
};

/**
 * Update user information
 */
export const updateUser = async (userId, data) => {
  if (!userId) throw apiError(400, "User id is required");

  const existing = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existing) throw apiError(404, "User not found");

  const { lastname, firstname, username } = data;

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      lastname: lastname ?? undefined,
      firstname: firstname ?? undefined,
      username: username ?? undefined,
    },
    include: {
      student: true,
      teacher: true,
    },
  });

  return mapUser(user);
};

/**
 * Delete a user
 */
export const deleteUser = async (userId) => {
  if (!userId) throw apiError(400, "User id is required");

  const existing = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existing) throw apiError(404, "User not found");

  return mapUser(
    await prisma.user.delete({
      where: { id: userId },
    })
  );
};

/**
 * Get QCM assigned to a student
 */
export const getAssignedQcmForStudent = async (studentId) => {
  if (!studentId) throw apiError(400, "Student id is required");

  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (!student) throw apiError(404, "Student not found");

  const results = await prisma.result.findMany({
    where: {
      student_id: studentId,
    },
    include: {
      qcm: {
        include: {
          topic: true,
          author: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  return results.map((result) => {
    return mapAssignedQcm(result);
  });
};
