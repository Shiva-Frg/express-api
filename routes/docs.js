/**
 * @swagger
 * componets:
 *   schemas:
 *    Accounts:
 *       type: object
 *       required:
 *         - id
 *         - username
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: integer,
 *           description: The auto-generated id of the user.
 *         username:
 *           type: string,
 *           description: The username of the user.
 *         email:
 *           type: string,
 *           description: The email of the user.
 *         password:
 *           type: string,
 *           description: The password of the user.
 *       example:
 *         id: 1456
 *         username: shiva
 *         email: shiva@gmail.com
 *         password: p@ssW0rd
 * tags:
 *   - name: Accounts
 *     description: API to manage your accounts.
 * paths:
 *   /accounts/:
 *     get:
 *       summary: Returns a list of users.
 *       tags:
 *         - Accounts
 *       responses:
 *         '200':    # status code
 *           description: A JSON array of users
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                    type: object
 *                    properties:
 *                     id:
 *                       type: integer
 *                       example: 1465
 *                     username:
 *                       type: string
 *                       example: 'shiva'
 *                     email:
 *                       type: 'string'
 *                       example: 'shiva@gmail.com'
 *                     password:
 *                       type: string
 *                       example: 'P@ssW0rd'
 *
 *         '500':
 *           description: Error server
 *           content:
 *             application/json:
 *               schema:
 *                 type: string
 *                 example: server error
 *       parameters:
 *        - in: query
 *          name: page
 *          schema:
 *             type: integer
 *        - in: query
 *          name: limit
 *          schema:
 *             type: integer
 *     post:
 *       summary: Creates a new user.
 *       tags:
 *         - Accounts
 *       responses:
 *         '200':    # status code
 *           description: The created user.
 *           content:
 *             application/json:
 *               schema:
 *                 type: string
 *                 example: "new account with id:1465 has been added successfully"
 *         '500':
 *           description: server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: string
 *       parameters:
 *         - in: header
 *           name: new user info
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1465
 *               username:
 *                 type: string
 *                 example: 'shiva'
 *               email:
 *                 type: 'string'
 *                 example: 'shiva@gmail.com'
 *               password:
 *                 type: string
 *                 example: 'P@ssW0rd'
 *           required: true
 *
 *   /accounts/{userId}:
 *     put:
 *       summary: Update a user.
 *       tags:
 *         - Accounts
 *       responses:
 *         '200':    # status code
 *           description: udate user
 *           content:
 *             application/json:
 *               schema:
 *                 type: string
 *                 example: "Account with id:1465 has been updated successfully"
 *         '404':
 *           description: not found user
 *           content:
 *             application/json:
 *               schema:
 *                 type: string
 *                 example: "Account with ID:1465 Not found!"
 *         '500':
 *           description: Error server
 *           content:
 *             application/json:
 *               schema:
 *                 type: string
 *                 example: "server error"
 *       parameters:
 *        - in: path
 *          name: userId
 *          schema:
 *             type: integer
 *          required: true
 *     delete:
 *       summary: Delete a user.
 *       tags:
 *         - Accounts
 *       responses:
 *         '200':    # status code
 *           description: delete user
 *           content:
 *             application/json:
 *               schema:
 *                 type: string
 *                 example: "Account with id:1465 has been deleted"
 *         '404':
 *           description: not found user
 *           content:
 *             application/json:
 *               schema:
 *                 type: string
 *                 example: "Account with ID:1465 Not found!"
 *         '500':
 *           description: Error server
 *           content:
 *             application/json:
 *               schema:
 *                 type: string
 *                 example: "server error"
 *       parameters:
 *        - in: path
 *          name: userId
 *          schema:
 *             type: integer
 *          required: true
 * components:
 *   schemas:
 *     Account:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1465
 *         username:
 *           type: string
 *           example: Jack
 *         email:
 *           type: string
 *           example: maddy@gmail.com
 *         password:
 *           type: string
 *           example: yddam5342
 *       # Both properties are required
 *       required:
 *         - id
 *         - username
 *         - email
 *         - password
 */
