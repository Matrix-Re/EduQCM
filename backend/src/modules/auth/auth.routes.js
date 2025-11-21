import express from 'express';
import {register, login, currentSession} from "./auth.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication management
 */

/**
 * @swagger
 * /auth/register:
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
 *               - lastName
 *               - firstName
 *               - username
 *               - password
 *               - role
 *             properties:
 *               lastName:
 *                 type: string
 *                 example: AMIRI
 *               firstName:
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
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     lastName:
 *                       type: string
 *                       example: AMIRI
 *                     firstName:
 *                       type: string
 *                       example: Anas
 *                     username:
 *                       type: string
 *                       example: aamiri
 *                     role:
 *                       type: string
 *                       example: student
 *                 token:
 *                   type: string
 *                   description: JWT token for authenticated requests
 *       400:
 *         description: Validation error or username already exists
 */
router.post("/register", register);

/**
 * @swagger
 * /auth/login:
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
 *                 example: jsmith
 *               password:
 *                 type: string
 *                 example: mypassword123
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     lastName:
 *                       type: string
 *                       example: Smith
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     username:
 *                       type: string
 *                       example: jsmith
 *                     role:
 *                       type: string
 *                       example: student
 *                 token:
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
 * /auth/session:
 *   tags: [Auth]
 *   get:
 *     summary: Récupère la session utilisateur actuelle
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Session retournée
 *       401:
 *         description: Token invalide ou manquant
 */
router.get("/session", currentSession);

export default router;
