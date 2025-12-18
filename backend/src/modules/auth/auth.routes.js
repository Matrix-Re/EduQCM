// backend/src/modules/auth/auth.routes.js
import express from 'express';
import {register, login, current_session, refresh} from "./auth.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication management
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Create a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lastname
 *               - firstname
 *               - username
 *               - password
 *               - role
 *             properties:
 *               lastname:
 *                 type: string
 *                 example: AMIRI
 *               firstname:
 *                 type: string
 *                 example: Anas
 *               username:
 *                 type: string
 *                 example: aamiri
 *               password:
 *                 type: string
 *                 example: mypassword123
 *               role:
 *                 type: string
 *                 enum: [student, teacher]
 *                 example: student
 *     responses:
 *       200:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 lastname:
 *                   type: string
 *                   example: AMIRI
 *                 firstname:
 *                   type: string
 *                   example: Anas
 *                 username:
 *                   type: string
 *                   example: aamiri
 *                 role:
 *                   type: string
 *                   example: student
 *                 access_token:
 *                   type: string
 *                   description: JWT token for authenticated requests
 *       400:
 *         description: Validation error or username already exists
 */
router.post("/register", register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     description: Validates username and password and returns a JWT token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: aamiri
 *               password:
 *                 type: string
 *                 example: mypassword123
 *     responses:
 *       200:
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 lastname:
 *                   type: string
 *                   example: AMIRI
 *                 firstname:
 *                   type: string
 *                   example: Anas
 *                 username:
 *                   type: string
 *                   example: aamiri
 *                 role:
 *                   type: string
 *                   example: student
 *                 access_token:
 *                   type: string
 *                   description: JWT token for authenticated requests
 *       400:
 *         description: Invalid username or incorrect password
 *       500:
 *         description: Server error
 */
router.post("/login", login);

/**
 * @swagger
 * /api/auth/current_session:
 *   get:
 *     tags: [Auth]
 *     summary: Getting current user session
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 lastname:
 *                   type: string
 *                   example: AMIRI
 *                 firstname:
 *                   type: string
 *                   example: Anas
 *                 username:
 *                   type: string
 *                   example: aamiri
 *                 role:
 *                   type: string
 *                   example: student
 *                 access_token:
 *                   type: string
 *                   description: JWT token for authenticated requests
 *       401:
 *         description: Token missing or invalid
 */
router.get("/current_session", current_session);

/**
 * @swagger
 * /api/auth/refresh:
 *   get:
 *     tags: [Auth]
 *     summary: Returns new access token
 *     responses:
 *       200:
 *         description: New access token issued
 *       401:
 *         description: Refresh token missing or invalid
 */
router.get("/refresh", refresh);

export default router;
