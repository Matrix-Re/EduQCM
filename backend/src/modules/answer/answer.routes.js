import express from "express";
import { create } from "./answer.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Answer
 *   description: Student answers to QCM questions
 */

/**
 * @swagger
 * /answer:
 *   post:
 *     summary: Submit a student answer for a specific QCM question
 *     tags: [Answer]
 *     description: Inserts an answer from a student for a given proposal.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resultId
 *               - proposalId
 *               - studentAnswer
 *             properties:
 *               resultId:
 *                 type: integer
 *                 example: 20
 *               proposalId:
 *                 type: integer
 *                 example: 88
 *               studentAnswer:
 *                 type: boolean
 *                 example: true
 *
 *     responses:
 *       200:
 *         description: Answer successfully recorded
 *       400:
 *         description: Missing data or invalid input
 *       404:
 *         description: Related entities not found
 *       500:
 *         description: Server error
 */
router.post("/", create);

export default router;
