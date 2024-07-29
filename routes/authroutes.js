const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

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
 *         verificationCode:
 *           type: string
 *           description: The verification code for the user
 *       example:
 *         email: user@example.com
 *         username: user123
 *         password: password123
 *         verified: false
 *         verificationCode: '123456'
 */

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: The user authentication and management API
 */

/**
 * @swagger
 * /signup/mongo:
 *   post:
 *     summary: Sign up a new user in MongoDB
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *                 verifyCode:
 *                   type: string
 *       400:
 *         description: Email already exists
 *       500:
 *         description: Some server error
 */
router.post('/signup/mongo', authController.signupMongo);

/**
 * @swagger
 * /login/mongo:
 *   post:
 *     summary: Log in a user in MongoDB
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Some server error
 */
router.post('/login/mongo', authController.loginMongo);

/**
 * @swagger
 * /verify/mongo:
 *   post:
 *     summary: Verify a user's account in MongoDB
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               verificationCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: User verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *       400:
 *         description: Invalid verification code or email
 *       500:
 *         description: Some server error
 */
router.post('/verify/mongo', authController.verifyUserMongo);

/**
 * @swagger
 * /forgot-password/mongo:
 *   post:
 *     summary: Reset password for a user in MongoDB
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *       400:
 *         description: Email not found
 *       500:
 *         description: Some server error
 */
router.post('/forgot-password/mongo', authController.forgotPasswordMongo);

/**
 * @swagger
 * /verify-email/mongo:
 *   post:
 *     summary: Verify if an email exists in MongoDB
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email exists
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
 *         description: Email not found
 *       500:
 *         description: Some server error
 */
router.post('/verify-email/mongo', authController.verifyEmailMongo);

/**
 * @swagger
 * /signup/postgres:
 *   post:
 *     summary: Sign up a new user in PostgreSQL
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *                 verifyCode:
 *                   type: string
 *       400:
 *         description: Email already exists
 *       500:
 *         description: Some server error
 */
router.post('/signup/postgres', authController.signupPostgres);

/**
 * @swagger
 * /login/postgres:
 *   post:
 *     summary: Log in a user in PostgreSQL
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Some server error
 */
router.post('/login/postgres', authController.loginPostgres);

/**
 * @swagger
 * /verify/postgres:
 *   post:
 *     summary: Verify a user's account in PostgreSQL
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               verificationCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: User verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *       400:
 *         description: Invalid verification code or email
 *       500:
 *         description: Some server error
 */
router.post('/verify/postgres', authController.verifyUserPostgres);

/**
 * @swagger
 * /forgot-password/postgres:
 *   post:
 *     summary: Reset password for a user in PostgreSQL
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *       400:
 *         description: Email not found
 *       500:
 *         description: Some server error
 */
router.post('/forgot-password/postgres', authController.forgotPasswordPostgres);

/**
 * @swagger
 * /verify-email/postgres:
 *   post:
 *     summary: Verify if an email exists in PostgreSQL
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email exists
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
 *         description: Email not found
 *       500:
 *         description: Some server error
 */
router.post('/verify-email/postgres', authController.verifyEmailPostgres);

/**
 * @swagger
 * /signout:
 *   post:
 *     summary: Sign out a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               id:
 *                 type: string
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: User signed out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 msg:
 *                   type: string
 *       400:
 *         description: No token provided
 *       500:
 *         description: Some server error
 */
router.post('/signout', authController.signout);

module.exports = router;
