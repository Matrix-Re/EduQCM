import { prisma } from "../../config/database.js";
import { apiError } from "../../utils/error.js";
import { mapQcm, mapQcmLight } from "../../mappers/qcm.mapper.js";
import { mapAssignedQcm } from "../../mappers/assignement.mapper.js";

/**
 * Create a new QCM
 */
export const createQcm = async ({ label, author_id, topic_id }) => {
    if (!label || !author_id || !topic_id) {
        throw apiError(400, "label, author_id and topic_id are required.");
    }

    if (Number.isNaN(author_id) || Number.isNaN(topic_id)) {
        throw apiError(400, "author_id and topic_id must be valid numbers.");
    }

    const teacher = await prisma.teacher.findUnique({ where: { id: author_id } });
  if (!teacher) throw apiError(404, "The specified teacher does not exist.");

    const topic = await prisma.topic.findUnique({ where: { id: topic_id } });
    if (!topic) throw apiError(404, "The specified topic does not exist.");

    return mapQcm(await prisma.qcm.create({
        data: {
            label: label,
            author_id,
            topic_id,
        },
        include: {
            topic: true,
            author: {
                include: {
                    user: { select: { id: true, firstname: true, lastname: true, username: true } },
                },
            },
        },
    }));
};

/**
 * Retrieve all QCMs
 */
export const getAllQcm = async () => {
    const qcms = await prisma.qcm.findMany({
        include: {
            topic: true,
            author: {
                include: {
                    user: { select: { id: true, firstname: true, lastname: true, username: true } },
                },
            },
        },
        orderBy: { created_at: "desc" },
    });

    return qcms.map(qcm => mapQcm(qcm));
};

/**
 * Retrieve a QCM by its ID (with questions and proposals)
 */
export const getQcmById = async (qcmId) => {
    if (!qcmId) throw apiError(400, "qcmId is required.");

    const id = Number(qcmId);
    if (Number.isNaN(id)) throw apiError(400, "qcmId must be a valid number.");

    const qcm = await prisma.qcm.findUnique({
        where: { id },
        include: {
        topic: true,
        author: {
            include: {
                user: { select: { id: true, firstname: true, lastname: true, username: true } },
            },
        },
        questions: {
            include: {
                proposals: true,
            },
            orderBy: { id: "asc" },
        },
        },
    });

    if (!qcm) throw apiError(404, "QCM not found.");

    return mapQcm(qcm);
};

/**
 * Delete a QCM and its related questions/proposals
 */
export const deleteQcm = async (qcmId) => {
    if (!qcmId) throw apiError(400, "qcmId is required.");

    const id = Number(qcmId);
    if (Number.isNaN(id)) throw apiError(400, "qcmId must be a valid number.");

    const existing = await prisma.qcm.findUnique({ where: { id } });
    if (!existing) throw apiError(404, "QCM not found.");

    // Delete proposals -> questions -> qcm
    await prisma.proposal.deleteMany({
        where: {
        question: { qcm_id: id },
        },
    });

    await prisma.question.deleteMany({
        where: { qcm_id: id },
    });

    return mapQcmLight(await prisma.qcm.delete({
        where: { id },
    }));
};

/**
 * Update a QCM
 */
export const updateQcm = async (qcmId, data) => {
    if (!qcmId) throw apiError(400, "Qcm id is required.");

    const id = Number(qcmId);
    if (Number.isNaN(id)) throw apiError(400, "Qcm id must be a valid number.");

    const existing = await prisma.qcm.findUnique({ where: { id } });
    if (!existing) throw apiError(404, "QCM not found.");

    const { label, topic_id } = data ?? {};

    if (topic_id !== undefined) {
        const topicIdNum = Number(topic_id);
        if (Number.isNaN(topicIdNum)) throw apiError(400, "Topic id must be a valid number.");

        const topic = await prisma.topic.findUnique({ where: { id: topicIdNum } });
        if (!topic) throw apiError(404, "The specified topic does not exist.");
    }

    return mapQcm(await prisma.qcm.update({
        where: { id },
        data: {
            label: label ?? undefined,
            topic_id,
        },
        include: {
            topic: true,
            author: {
                include: {
                    user: { select: { id: true, firstname: true, lastname: true, username: true } },
                },
            },
        },
    }));
};

/**
 * Assign a QCM to a student (create a Result entry)
 */
export const assignQcmToStudent = async (qcmId, studentId) => {
    if (!qcmId || !studentId) {
        throw apiError(400, "Qcm id and student id are required.");
    }

    const qcm_id = Number(qcmId);
    const student_id = Number(studentId);

    if (Number.isNaN(qcm_id) || Number.isNaN(student_id)) {
        throw apiError(400, "Qcm id and student id must be valid numbers.");
    }

    const qcm = await prisma.qcm.findUnique({ where: { id: qcm_id } });
    if (!qcm) throw apiError(404, "QCM not found.");

    const student = await prisma.student.findUnique({ where: { id: student_id } });
    if (!student) throw apiError(404, "Student not found.");

    return mapAssignedQcm(await prisma.result.create({
        data: {
        assignment_date: new Date(),
        completion_date: null,
        score: null,
        qcm_id,
        student_id,
        },
        include: {
            qcm: {
                include: {
                    topic: true,
                    author: {
                        include: {
                            user: true
                        }
                    }
                }
            }
        },
    }));
};
