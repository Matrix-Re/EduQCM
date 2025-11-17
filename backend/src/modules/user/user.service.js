import prisma from "../../config/db.js";

/**
 * Retrieve all users
 */
export const getAllUsers = async () => {
    return prisma.user.findMany({
        include: {
            student: true,
            teacher: true
        }
    });
};

/**
 * Retrieve a single user by ID
 */
export const getUserById = async (userId) => {
    if (!userId) throw new Error("userId is required.");

    const user = await prisma.user.findUnique({
        where: { UserId: Number(userId) },
        include: {
            student: true,
            teacher: true
        }
    });

    if (!user) throw new Error("User not found.");

    return user;
};

/**
 * Update user information
 */
export const updateUser = async (userId, data) => {
    if (!userId) throw new Error("userId is required.");

    const existing = await prisma.user.findUnique({
        where: { UserId: Number(userId) }
    });
    if (!existing) throw new Error("User not found.");

    const { lastName, firstName, username } = data;

    return prisma.user.update({
        where: { UserId: Number(userId) },
        data: {
            lastName: lastName ?? undefined,
            firstName: firstName ?? undefined,
            username: username ?? undefined
        }
    });
};

/**
 * Delete a user
 */
export const deleteUser = async (userId) => {
    if (!userId) throw new Error("userId is required.");

    const existing = await prisma.user.findUnique({
        where: { UserId: Number(userId) }
    });
    if (!existing) throw new Error("User not found.");

    // Remove student/teacher profile
    await prisma.student.deleteMany({ where: { UserId: Number(userId) } });
    await prisma.teacher.deleteMany({ where: { UserId: Number(userId) } });

    // Remove results referencing this user
    await prisma.result.deleteMany({ where: { userId: Number(userId) } });

    return prisma.user.delete({
        where: { UserId: Number(userId) }
    });
};

/**
 * Get QCM assigned to a student
 */
export const getAssignedQcmForStudent = async (studentId) => {
    if (!studentId) throw new Error("studentId is required.");

    // Check if student exists
    const student = await prisma.student.findUnique({
        where: { UserId: Number(studentId) }
    });

    if (!student) throw new Error("Student not found.");

    // Retrieve their assigned QCMs
    const results = await prisma.result.findMany({
        where: { userId: Number(studentId) },
        include: {
            qcm: {
                include: {
                    topic: true,
                    author: {
                        include: {
                            user: {
                                select: {
                                    firstName: true,
                                    lastName: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    return results;
};
