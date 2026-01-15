import express from "express";
import { getQuestionsByPage, finish } from "./session.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Session
 *   description: Handle QCM completion and score calculation
 */

/**
 * @swagger
 * /api/session/{sessionId}/questions:
 *   get:
 *     summary: Retrieve paginated questions for a specific session
 *     description: Retrieve questions associated with the QCM linked to a session.
 *     tags: [Session]
 *     parameters:
 *       - name: sessionId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       200:
 *         description: Paginated list of questions
 *       404:
 *         description: Session not found
 */
router.get("/:id/questions", getQuestionsByPage);

/**
 * @swagger
 * /api/session/{id}/finish:
 *   put:
 *     summary: Calculate and update the student's score for a QCM
 *     tags: [Session]
 *     description: Computes the score based on the answers stored in the Answer table.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: SessionId of the assigned QCM
 *         example: 15
 *
 *     responses:
 *       200:
 *         description: Score updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Session not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id/finish", finish);

export default router;
