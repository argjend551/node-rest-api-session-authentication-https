const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
const path = require('path');
const RestApi = require('./RestApi');
const errorHandler = require('./middleware/GlobalException');

module.exports = class Server {
  app = express();
  port = 4000;

  constructor() {
    this.start();
  }

  start() {
    this.app.use(cookieParser());
    require('dotenv').config({
      path: 'backend/secrets/secrets.env',
      encoding: 'utf8',
    });
    this.app.use(
      session({
        secret: process.env.SECRET,
        resave: true,
        saveUninitialized: true,
        cookie: {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
          maxAge: parseInt(process.env.MAX_AGE), // expires after 10min
        },
      })
    );

    this.app.use(
      cors({
        origin: 'https://127.0.0.1:3000',
        credentials: true,
      })
    );

    this.app.use(express.json()); // to support JSON-encoded bodies

    this.app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

    // Load the security certificate and private key
    const options = {
      key: fs.readFileSync(path.join(__dirname, 'secrets/cert', 'key.pem')),
      cert: fs.readFileSync(path.join(__dirname, 'secrets/cert', 'cert.pem')),
    };

    new RestApi(this.app);

    // Create an HTTPS server
    const server = https.createServer(options, this.app);

    // Start listening for incoming connections
    server.listen(this.port, () => {
      console.log(`Backend listening on port ${this.port}`);
    });

    this.app.use(errorHandler);
  }
};
