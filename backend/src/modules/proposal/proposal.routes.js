import express from "express";
import { create, modify, remove } from "./proposal.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Proposal
 *   description: Manage answer proposals for questions
 */

/**
 * @swagger
 * /proposal:
 *   post:
 *     summary: Create a new proposal for a question
 *     description: Adds a proposal to an existing question.
 *     tags: [Proposal]
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - proposalLabel
 *               - questionId
 *               - isCorrect
 *             properties:
 *               proposalLabel:
 *                 type: string
 *                 description: Text of the proposal
 *                 example: Paris is the capital of France.
 *               questionId:
 *                 type: integer
 *                 description: ID of the question this proposal belongs to
 *                 example: 10
 *               isCorrect:
 *                 type: boolean
 *                 description: Indicates whether the proposal is correct
 *                 example: true
 *
 *     responses:
 *       200:
 *         description: Proposal successfully created
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post("/", create);

/**
 * @swagger
 * /proposal/{id}:
 *   put:
 *     summary: Modify a proposal
 *     description: Updates the text or correctness of an existing proposal.
 *     tags: [Proposal]
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the proposal to modify
 *         example: 4
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               proposalLabel:
 *                 type: string
 *                 description: New proposal text
 *                 example: Lyon
 *               isCorrect:
 *                 type: boolean
 *                 description: Whether the proposal is correct
 *                 example: false
 *
 *     responses:
 *       200:
 *         description: Proposal successfully updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Proposal not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", modify);

/**
 * @swagger
 * /proposal/{id}:
 *   delete:
 *     summary: Delete a proposal
 *     description: Deletes a proposal using its ID.
 *     tags: [Proposal]
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the proposal to delete
 *         example: 4
 *
 *     responses:
 *       200:
 *         description: Proposal successfully deleted
 *       400:
 *         description: Validation error
 *       404:
 *         description: Proposal not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", remove);

export default router;
