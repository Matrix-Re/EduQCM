import express from "express";
import { create, modify, remove, get } from "./question.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Question
 *   description: Manage QCM questions
 */

/**
 * @swagger
 * /question:
 *   post:
 *     summary: Create a new question inside a QCM
 *     description: Adds a question to an existing QCM. questionLabel and qcmId are required.
 *     tags: [Question]
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - questionLabel
 *               - qcmId
 *             properties:
 *               questionLabel:
 *                 type: string
 *                 description: The text of the question
 *                 example: What is the capital of France?
 *               questionTime:
 *                 type: integer
 *                 nullable: true
 *                 description: Time allowed to answer (in seconds)
 *                 example: 30
 *               qcmId:
 *                 type: integer
 *                 description: ID of the QCM this question belongs to
 *                 example: 2
 *
 *     responses:
 *       200:
 *         description: Question successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 questionId:
 *                   type: integer
 *                   example: 10
 *                 questionLabel:
 *                   type: string
 *                   example: What is the capital of France?
 *                 questionTime:
 *                   type: integer
 *                   nullable: true
 *                   example: 30
 *                 qcmId:
 *                   type: integer
 *                   example: 2
 *
 *       400:
 *         description: Missing or invalid fields
 *
 *       500:
 *         description: Internal server error
 */
router.post("/", create);

/**
 * @swagger
 * /question/{id}:
 *   put:
 *     summary: Update an existing question
 *     description: Updates the label or time of a question.
 *     tags: [Question]
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the question to update
 *         example: 12
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questionLabel:
 *                 type: string
 *                 nullable: true
 *                 example: What is the capital of Japan?
 *               questionTime:
 *                 type: integer
 *                 nullable: true
 *                 example: 45
 *
 *     responses:
 *       200:
 *         description: Question successfully updated
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Question not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", modify);

/**
 * @swagger
 * /question/{id}:
 *   delete:
 *     summary: Delete a question
 *     description: Deletes a question and all associated proposals.
 *     tags: [Question]
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the question to delete
 *         example: 12
 *
 *     responses:
 *       200:
 *         description: Question successfully deleted
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Question not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", remove);

/**
 * @swagger
 * /question/{id}:
 *   get:
 *     summary: Retrieve a question
 *     description: Retrieves a question by its ID along with all associated proposals.
 *     tags: [Question]
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the question
 *         example: 12
 *
 *     responses:
 *       200:
 *         description: Question successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 questionId:
 *                   type: integer
 *                   example: 12
 *                 questionLabel:
 *                   type: string
 *                   example: What is the capital of Italy?
 *                 questionTime:
 *                   type: integer
 *                   example: 30
 *                 qcmId:
 *                   type: integer
 *                   example: 2
 *                 proposals:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       proposalId:
 *                         type: integer
 *                         example: 101
 *                       proposalLabel:
 *                         type: string
 *                         example: Rome
 *                       isCorrect:
 *                         type: boolean
 *                         example: true
 *
 *       400:
 *         description: Missing or invalid ID
 *
 *       404:
 *         description: Question not found
 *
 *       500:
 *         description: Internal server error
 */
router.get("/:id", get);

export default router;
