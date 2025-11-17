import express from "express";
import {
    create,
    getOne,
    getAll,
    remove,
    modify,
    assign
} from "./quiz.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: QCM
 *   description: Manage QCMs (quizzes)
 */

/**
 * @swagger
 * /qcm:
 *   post:
 *     summary: Create a new QCM
 *     tags: [QCM]
 *     description: Creates a new quiz associated with a teacher and a topic.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - qcmLabel
 *               - authorId
 *               - topicId
 *             properties:
 *               qcmLabel:
 *                 type: string
 *                 example: "European Capitals Quiz"
 *               authorId:
 *                 type: integer
 *                 description: ID of the teacher authoring the QCM
 *                 example: 3
 *               topicId:
 *                 type: integer
 *                 description: ID of the subject/topic of the QCM
 *                 example: 1
 *
 *     responses:
 *       200:
 *         description: QCM successfully created
 *       400:
 *         description: Missing or invalid fields
 *       500:
 *         description: Internal server error
 */
router.post("/", create);

/**
 * @swagger
 * /qcm:
 *   get:
 *     summary: Retrieve all QCMs
 *     tags: [QCM]
 *     description: Returns all quizzes.
 *
 *     responses:
 *       200:
 *         description: List of QCMs returned successfully
 *       500:
 *         description: Internal server error
 */
router.get("/", getAll);

/**
 * @swagger
 * /qcm/{id}:
 *   get:
 *     summary: Retrieve a specific QCM
 *     tags: [QCM]
 *     description: Returns the QCM with all its questions.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 5
 *
 *     responses:
 *       200:
 *         description: QCM retrieved successfully
 *       404:
 *         description: QCM not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getOne);

/**
 * @swagger
 * /qcm/{id}:
 *   delete:
 *     summary: Delete a QCM
 *     tags: [QCM]
 *     description: Deletes a quiz and all associated questions and proposals.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 7
 *
 *     responses:
 *       200:
 *         description: QCM deleted successfully
 *       404:
 *         description: QCM not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", remove);

/**
 * @swagger
 * /qcm/{id}:
 *   put:
 *     summary: Update a QCM
 *     tags: [QCM]
 *     description: Updates the label or topic of a quiz.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 4
 *
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               qcmLabel:
 *                 type: string
 *                 example: "Updated QCM title"
 *               topicId:
 *                 type: integer
 *                 example: 2
 *
 *     responses:
 *       200:
 *         description: QCM updated successfully
 *       404:
 *         description: QCM not found
 *       400:
 *         description: Missing or invalid fields
 *       500:
 *         description: Internal server error
 */
router.put("/:id", modify);

/**
 * @swagger
 * /qcm/{id}/assign:
 *   post:
 *     summary: Assign a QCM to a student
 *     tags: [QCM]
 *     description: Creates a result entry (assignment) for a student to complete the QCM.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the QCM to assign
 *         example: 5
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *             properties:
 *               studentId:
 *                 type: integer
 *                 example: 12
 *
 *     responses:
 *       200:
 *         description: QCM successfully assigned to the student
 *       400:
 *         description: Missing parameters
 *       404:
 *         description: Student or QCM not found
 *       500:
 *         description: Internal server error
 */
router.post("/:id/assign", assign);

export default router;
