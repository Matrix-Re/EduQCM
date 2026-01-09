import express from "express";
import { create, getAll, getOne, remove, modify } from "./topic.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Topic
 *   description: Manage QCM topics
 */

/**
 * @swagger
 * /api/topic:
 *   post:
 *     summary: Create a new topic
 *     tags: [Topic]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [label]
 *             properties:
 *               label:
 *                 type: string
 *                 example: Mathematics
 *     responses:
 *       200:
 *         description: Topic successfully created
 *       400:
 *         description: Missing or invalid data
 *       500:
 *         description: Internal server error
 */
router.post("/", create);

/**
 * @swagger
 * /api/topic:
 *   get:
 *     summary: Retrieve all topics
 *     tags: [Topic]
 *     responses:
 *       200:
 *         description: List of topics returned successfully
 *       500:
 *         description: Internal server error
 */
router.get("/", getAll);

/**
 * @swagger
 * /api/topic/{id}:
 *   get:
 *     summary: Retrieve a specific topic
 *     tags: [Topic]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 3
 *     responses:
 *       200:
 *         description: Topic retrieved successfully
 *       404:
 *         description: Topic not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getOne);

/**
 * @swagger
 * /api/topic/{id}:
 *   delete:
 *     summary: Delete a topic
 *     tags: [Topic]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 5
 *     responses:
 *       200:
 *         description: Topic deleted successfully
 *       404:
 *         description: Topic not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", remove);

/**
 * @swagger
 * /api/topic/{id}:
 *   put:
 *     summary: Update a topic
 *     tags: [Topic]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               label:
 *                 type: string
 *                 example: Physics
 *     responses:
 *       200:
 *         description: Topic updated successfully
 *       400:
 *         description: Missing or invalid data
 *       404:
 *         description: Topic not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", modify);

export default router;
