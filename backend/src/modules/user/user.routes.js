import express from "express";
import {
    getAll,
    getOne,
    modify,
    remove,
    getAssignedQcm
} from "./user.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Manage users (students and teachers)
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Retrieve all users
 *     tags: [User]
 *     description: Returns all registered users.
 *
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get("/", getAll);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Retrieve a specific user
 *     tags: [User]
 *     description: Returns details of a user (student or teacher).
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 12
 *
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getOne);

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [User]
 *     description: Updates user information.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 10
 *
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               lastName:
 *                 type: string
 *               firstName:
 *                 type: string
 *               username:
 *                 type: string
 *
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       400:
 *         description: Invalid data
 *       500:
 *         description: Internal server error
 */
router.put("/:id", modify);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [User]
 *     description: Removes a user permanently from the system.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 8
 *
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", remove);

/**
 * @swagger
 * /user/{id}/qcm:
 *   get:
 *     summary: Get all QCM assigned to a student
 *     tags: [User]
 *     description: Retrieves all QCM that have been assigned to a student.
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the student
 *         example: 15
 *
 *     responses:
 *       200:
 *         description: List of assigned QCMs returned successfully
 *       404:
 *         description: Student not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id/qcm", getAssignedQcm);

export default router;
