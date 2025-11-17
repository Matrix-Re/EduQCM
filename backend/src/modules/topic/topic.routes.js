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
 * /topic:
 *   post:
 *     summary: Create a new topic
 *     tags: [Topic]
 *     description: Creates a new topic for organizing QCM questions.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *             properties:
 *               description:
 *                 type: string
 *                 example: Mathematics
 *
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
 * /topic:
 *   get:
 *     summary: Retrieve all topics
 *     tags: [Topic]
 *     description: Returns the list of all available topics.
 *
 *     responses:
 *       200:
 *         description: List of topics returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   TopicId:
 *                     type: integer
 *                     example: 1
 *                   description:
 *                     type: string
 *                     example: Mathematics
 *
 *       500:
 *         description: Internal server error
 */
router.get("/", getAll);

/**
 * @swagger
 * /topic/{id}:
 *   get:
 *     summary: Retrieve a specific topic
 *     tags: [Topic]
 *     description: Retrieves the topic based on its ID.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the topic to retrieve
 *         example: 3
 *
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
 * /topic/{id}:
 *   delete:
 *     summary: Delete a topic
 *     tags: [Topic]
 *     description: Deletes a topic by its ID.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the topic to delete
 *         example: 5
 *
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
 * /topic/{id}:
 *   put:
 *     summary: Update a topic
 *     tags: [Topic]
 *     description: Updates the description of a topic.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the topic to update
 *         example: 2
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: Physics
 *
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
