/**
 * @swagger
 * /registerUser:
 *   post:
 *     tags:
 *       - User
 *     summary: "Register a new user"
 *     description: "Register a new user with the provided username, password, and user type."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: "Username of the new user"
 *               password:
 *                 type: string
 *                 description: "Password of the new user"
 *               userType:
 *                 type: string
 *                 description: "Type of the new user (admin or host)"
 *             required:
 *               - username
 *               - password
 *               - userType
 *     responses:
 *       200:
 *         description: "Registration successful"
 *       400:
 *         description: "Bad request - Missing required fields or username already exists"
 *         schema:
 *           $ref: '#/definitions/Error'
 *       500:
 *         description: "Internal Server Error"
 *         schema:
 *           $ref: '#/definitions/Error'
 */

/**
 /**
 * @swagger
 * /register/admin:
 *   post:
 *     tags:
 *       - Admin
 *     summary: "Register a new admin user"
 *     description: "Register a new admin user with the provided username and password."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: "Username of the new admin user"
 *               password:
 *                 type: string
 *                 description: "Password of the new admin user"
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: "Admin registration successful"
 *       400:
 *         description: "Bad request - Missing required fields or username already exists"
 *         schema:
 *           $ref: '#/definitions/Error'
 *       500:
 *         description: "Internal Server Error"
 *         schema:
 *           $ref: '#/definitions/Error'
 */

 /**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - User
 *     summary: "User login"
 *     description: "Authenticate and log in a user based on the provided username and password."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: "Username of the user"
 *               password:
 *                 type: string
 *                 description: "Password of the user"
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: "Login successful"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: "JWT token for authentication"
 *       400:
 *         description: "Bad request - Missing required fields or invalid credentials"
 *         schema:
 *           $ref: '#/definitions/Error'
 *       500:
 *         description: "Internal Server Error"
 *         schema:
 *           $ref: '#/definitions/Error'
 */

/**
 * @swagger
 * /login/admin:
 *   post:
 *     tags:
 *       - Admin
 *     summary: "Admin login"
 *     description: "Authenticate and log in an admin user based on the provided username and password."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: "Username of the admin user"
 *               password:
 *                 type: string
 *                 description: "Password of the admin user"
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: "Admin login successful"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: "JWT token for authentication"
 *       400:
 *         description: "Bad request - Missing required fields or invalid credentials"
 *         schema:
 *           $ref: '#/definitions/Error'
 *       500:
 *         description: "Internal Server Error"
 *         schema:
 *           $ref: '#/definitions/Error'
 */

/**
 * @swagger
 * /delete/user/{username}/{userType}:
 *   delete:
 *     tags:
 *       - User
 *     summary: "Delete a user"
 *     description: "Delete a user based on the provided username and user type."
 *     parameters:
 *       - name: username
 *         in: path
 *         description: "Username of the user to delete"
 *         required: true
 *         type: string
 *       - name: userType
 *         in: path
 *         description: "Type of the user to delete (admin or host)"
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: "User deleted successfully"
 *       400:
 *         description: "Bad request - User not found"
 *         schema:
 *           $ref: '#/definitions/Error'
 *       500:
 *         description: "Internal Server Error"
 *         schema:
 *           $ref: '#/definitions/Error'
 */

/**
 * @swagger
 * /users/{userType}:
 *   get:
 *     tags:
 *       - User
 *     summary: "View all User"
 *     description: "Retrieve a list of all users based on the provided user type."
 *     parameters:
 *       - name: userType
 *         in: path
 *         description: "Type of the users to retrieve (admin or host)"
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: "List of users retrieved successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/User'
 *       500:
 *         description: "Internal Server Error"
 *         schema:
 *           $ref: '#/definitions/Error'
 */

