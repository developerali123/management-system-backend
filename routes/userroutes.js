const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middleware/authenticateToken');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and retrieval
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - username
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         email:
 *           type: string
 *           description: The user's email
 *         username:
 *           type: string
 *           description: The user's username
 *         password:
 *           type: string
 *           description: The user's password
 *         verified:
 *           type: boolean
 *           description: Whether the user is verified
 *       example:
 *         id: "60d0fe4f5311236168a109ca"
 *         email: "user@example.com"
 *         username: "user123"
 *         password: "hashedpassword"
 *         verified: false
 * 
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /users/mongo:
 *   get:
 *     summary: Get all users (MongoDB)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Some server error
 */
router.get('/mongo', userController.getAllUsersMongo);

/**
 * @swagger
 * /users/mongo/{id}:
 *   get:
 *     summary: Get a user by ID (MongoDB)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The user description by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The user was not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Some server error
 */
router.get('/mongo/:id', userController.getUserByIdMongo);

/**
 * @swagger
 * /users/mongo/{id}:
 *   put:
 *     summary: Update a user by ID (MongoDB)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *       404:
 *         description: The user was not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Some server error
 */
router.put('/mongo/:id', userController.updateUserByIdMongo);

/**
 * @swagger
 * /users/mongo/{id}:
 *   delete:
 *     summary: Delete a user by ID (MongoDB)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The user was deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *       404:
 *         description: The user was not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Some server error
 */
router.delete('/mongo/:id', userController.deleteUserByIdMongo);

/**
 * @swagger
 * /users/mongo:
 *   delete:
 *     summary: Delete all users (MongoDB)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All users were deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Some server error
 */
router.delete('/mongo', userController.deleteAllUsersMongo);

/**
 * @swagger
 * /users/postgres:
 *   get:
 *     summary: Get all users (PostgreSQL)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Some server error
 */
router.get('/postgres', userController.getAllUsersPostgres);

/**
 * @swagger
 * /users/postgres/{id}:
 *   get:
 *     summary: Get a user by ID (PostgreSQL)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The user description by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The user was not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Some server error
 */
router.get('/postgres/:id', userController.getUserByIdPostgres);

/**
 * @swagger
 * /users/postgres/{id}:
 *   put:
 *     summary: Update a user by ID (PostgreSQL)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *       404:
 *         description: The user was not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Some server error
 */
router.put('/postgres/:id', userController.updateUserByIdPostgres);

/**
 * @swagger
 * /users/postgres/{id}:
 *   delete:
 *     summary: Delete a user by ID (PostgreSQL)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The user was deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *       404:
 *         description: The user was not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Some server error
 */
router.delete('/postgres/:id', userController.deleteUserByIdPostgres);

/**
 * @swagger
 * /users/postgres:
 *   delete:
 *     summary: Delete all users (PostgreSQL)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All users were deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Some server error
 */
router.delete('/postgres', userController.deleteAllUsersPostgres);

module.exports = router;
