import express from "express";
import {
  create,
  getOne,
  getAll,
  remove,
  modify,
  assign,
} from "./qcm.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: QCM
 *   description: Manage QCMs
 */

/**
 * @swagger
 * /api/qcm:
 *   post:
 *     summary: Create a new QCM
 *     tags: [QCM]
 *     description: Creates a new QCM associated with a teacher and a topic.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - label
 *               - author_id
 *               - topic_id
 *               - time_limit
 *             properties:
 *               label:
 *                 type: string
 *                 example: "European Capitals QCM"
 *               time_limit:
 *                 type: integer
 *                 example: 30
 *               author_id:
 *                 type: integer
 *                 description: Teacher ID (same as user id)
 *                 example: 3
 *               topic_id:
 *                 type: integer
 *                 description: Topic ID
 *                 example: 1
 *
 *     responses:
 *       200:
 *         description: QCM successfully created
 *       400:
 *         description: Missing or invalid fields
 *       404:
 *         description: Teacher or topic not found
 *       500:
 *         description: Internal server error
 */
router.post("/", create);

/**
 * @swagger
 * /api/qcm:
 *   get:
 *     summary: Retrieve all QCMs
 *     tags: [QCM]
 *     description: Returns all QCMs.
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
 * /api/qcm/{id}:
 *   get:
 *     summary: Retrieve a specific QCM
 *     tags: [QCM]
 *     description: Returns the QCM with all its questions and proposals.
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
 * /api/qcm/{id}:
 *   delete:
 *     summary: Delete a QCM
 *     tags: [QCM]
 *     description: Deletes a QCM and all associated questions and proposals.
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
 * /api/qcm/{id}:
 *   put:
 *     summary: Update a QCM
 *     tags: [QCM]
 *     description: Updates the label or topic of a QCM.
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
 *               label:
 *                 type: string
 *                 example: "Updated QCM title"
 *               topic_id:
 *                 type: integer
 *                 example: 2
 *               time_limit:
 *                 type: integer
 *                 example: 25
 *
 *     responses:
 *       200:
 *         description: QCM updated successfully
 *       404:
 *         description: QCM or topic not found
 *       400:
 *         description: Invalid data
 *       500:
 *         description: Internal server error
 */
router.put("/:id", modify);

/**
 * @swagger
 * /api/qcm/{id}/assign:
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
 *               - student_id
 *             properties:
 *               student_id:
 *                 type: integer
 *                 description: Student ID (same as user id)
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
