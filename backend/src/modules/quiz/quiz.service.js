import prisma from "../../config/db.js";

/**
 * Create a new QCM
 */
export const createQcm = async ({ qcmLabel, authorId, topicId }) => {
    if (!qcmLabel || !authorId || !topicId) {
        throw new Error("qcmLabel, authorId and topicId are required.");
    }

    // Ensure teacher exists
    const teacher = await prisma.teacher.findUnique({
        where: { UserId: Number(authorId) }
    });
    if (!teacher) {
        throw new Error("The specified teacher does not exist.");
    }

    // Ensure topic exists
    const topic = await prisma.topic.findUnique({
        where: { TopicId: Number(topicId) }
    });
    if (!topic) {
        throw new Error("The specified topic does not exist.");
    }

    return prisma.qCM.create({
        data: {
            QCMLabel: qcmLabel,
            authorId: Number(authorId),
            topicId: Number(topicId),
        }
    });
};

/**
 * Retrieve all QCMs
 */
export const getAllQcm = async () => {
    return prisma.qCM.findMany({
        include: {
            topic: true,
            author: {
                select: {
                    UserId: true,
                    user: {
                        select: {
                            firstName: true,
                            lastName: true
                        }
                    }
                }
            }
        }
    });
};

/**
 * Retrieve a QCM by its ID (with questions and proposals)
 */
export const getQcmById = async (qcmId) => {
    if (!qcmId) throw new Error("qcmId is required.");

    const qcm = await prisma.qCM.findUnique({
        where: { QCMId: Number(qcmId) },
        include: {
            questions: {
                include: {
                    proposals: true
                }
            },
            topic: true,
            author: {
                select: {
                    UserId: true,
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            username: true,
                        }
                    }
                }
            }
        }
    });

    if (!qcm) throw new Error("QCM not found.");

    return qcm;
};

/**
 * Delete a QCM and its related questions/proposals
 */
export const deleteQcm = async (qcmId) => {
    if (!qcmId) throw new Error("qcmId is required.");

    // Check existence
    const existing = await prisma.qCM.findUnique({
        where: { QCMId: Number(qcmId) }
    });

    if (!existing) {
        throw new Error("QCM not found.");
    }

    const id = Number(qcmId);

    // Delete all proposals inside questions
    await prisma.proposal.deleteMany({
        where: {
            question: { qcmId: id }
        }
    });

    // Delete the questions
    await prisma.question.deleteMany({
        where: { qcmId: id }
    });

    // Delete the QCM
    return prisma.qCM.delete({
        where: { QCMId: id }
    });
};

/**
 * Update a QCM
 */
export const updateQcm = async (qcmId, data) => {
    if (!qcmId) throw new Error("qcmId is required.");

    const existing = await prisma.qCM.findUnique({
        where: { QCMId: Number(qcmId) }
    });

    if (!existing) throw new Error("QCM not found.");

    const { qcmLabel, topicId } = data;

    return prisma.qCM.update({
        where: { QCMId: Number(qcmId) },
        data: {
            QCMLabel: qcmLabel ?? undefined,
            topicId: topicId ? Number(topicId) : undefined
        }
    });
};

/**
 * Assign a QCM to a student (create a Result entry)
 */
export const assignQcmToStudent = async (qcmId, studentId) => {
    if (!qcmId || !studentId) {
        throw new Error("qcmId and studentId are required.");
    }

    // Check QCM exists
    const qcm = await prisma.qCM.findUnique({
        where: { QCMId: Number(qcmId) }
    });
    if (!qcm) throw new Error("QCM not found.");

    // Check student exists
    const student = await prisma.student.findUnique({
        where: { UserId: Number(studentId) }
    });
    if (!student) throw new Error("Student not found.");

    // Create assignment (Result row)
    return prisma.result.create({
        data: {
            assignmentDate: new Date(),
            completionDate: null,
            score: null,
            qcmId: Number(qcmId),
            userId: Number(studentId)
        }
    });
};
