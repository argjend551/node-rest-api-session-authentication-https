const uuid = require('uuid');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const validator = require('validator');
const InvalidInputException = require('../backend/Exceptions/InvalidInputException');
const NotLoggedInException = require('../backend/Exceptions/NotLoggedInException');

module.exports = class RestApi {
  constructor(expressapp) {
    this.app = expressapp;
    this.start();
  }

  start() {
    const db = mysql.createPool(require('./secrets/dbCredentials.json'));
    const saltRounds = parseInt(process.env.SALT_ROUNDS);
    const salt = process.env.SALT;
    const pepper = process.env.PEPPER;

    this.app.post('/api/register', async (req, res, next) => {
      try {
        // Validate the request body
        if (!req.body.username || !req.body.name || !req.body.password) {
          throw new InvalidInputException(
            'Please provide a username, name, and password',
            400
          );
        }

        const normalizedEmail = validator.normalizeEmail(req.body.username);

        if (!validator.isEmail(normalizedEmail)) {
          throw new InvalidInputException(
            'Please provide a valid email address',
            400
          );
        }

        // Check if the user's email already exists in the database
        const existingUser = await db.query(
          `SELECT * FROM users WHERE username = ?`,
          [normalizedEmail]
        );

        if (existingUser[0].length) {
          throw new InvalidInputException(
            'A user with this email address already exists',
            400
          );
        }

        // Check if the password and its confirmation match
        if (req.body.password !== req.body.confirmPassword) {
          throw new InvalidInputException('Passwords does not match', 400);
        }

        // create a UUID for the user
        const id = uuid.v4();

        // Encrypt the user's password
        const encrypted = bcrypt.hashSync(
          req.body.password + salt + pepper,
          saltRounds
        );

        // Insert the user's details into the database
        await db.query(
          `INSERT INTO users (user_id, username, password, name) VALUES (?, ?, ?, ?)`,
          [id, normalizedEmail, encrypted, req.body.name]
        );

        // If all checks pass, return a success message
        return res.send({ message: 'Registration successful' });
      } catch (error) {
        next(error);
      }
    });

    this.app.post('/api/login', async (req, res, next) => {
      try {
        // Check if the user has provided a username and password
        if (!req.body.username || !req.body.password) {
          throw new InvalidInputException(
            'Please provide a username and password',
            400
          );
        }
        const normalizedEmail = validator.normalizeEmail(req.body.username);

        // Check if the user exists in the database
        const user = await db.query(`SELECT * FROM users WHERE username = ?`, [
          normalizedEmail,
        ]);

        if (!user[0].length) {
          throw new InvalidInputException('Invalid username or password', 400);
        }

        // If the user exists, get the user's password and UUID from the database
        const { id, password, username, name } = user[0].shift();

        // Compare the user's password with the encrypted password using the bcrypt.compareSync method
        const isMatch = bcrypt.compareSync(
          req.body.password + salt + pepper,
          password
        );

        // If the password is incorrect, return a bad request error
        if (!isMatch) {
          throw new InvalidInputException('Invalid username or password', 400);
        }

        // If the password is correct, save the user's ID in the session
        req.session.user = {
          userId: id,
          username: username,
          name: name,
        };

        req.session.save();

        return res.send({ loggedIn: true, user: req.session.user });
      } catch (error) {
        next(error);
      }
    });

    this.app.get('/api/myProfile', async (req, res, next) => {
      try {
        // Check if the user is logged in
        if (req.session.user) {
          return res.send({ loggedIn: true, user: req.session.user });
        }
        throw new NotLoggedInException('User is not logged in', false, 401);
      } catch (error) {
        next(error);
      }
    });

    this.app.post('/api/logout', async (req, res, next) => {
      try {
        // Check if the user is logged in
        if (!req.session.user) {
          throw new NotLoggedInException('User is not logged in', 401);
        }
        // Remove the user's information from the session object
        await req.session.destroy();
        // remove the session cookie
        res.clearCookie('connect.sid');
        res.send({ message: 'Logged out!' });
      } catch (error) {
        next(error);
      }
    });
  }
};
