import express from "express";
import { update } from "./result.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Result
 *   description: Handle QCM completion and score calculation
 */

/**
 * @swagger
 * /result/{id}:
 *   put:
 *     summary: Calculate and update the student's score for a QCM
 *     tags: [Result]
 *     description: Computes the score based on the answers stored in the Answer table.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ResultId of the assigned QCM
 *         example: 15
 *
 *     responses:
 *       200:
 *         description: Score updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Result not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", update);

export default router;
