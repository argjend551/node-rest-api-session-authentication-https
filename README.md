# REST API
This is a simple REST API for user authentication using sessions and a MySQL database built with Node.js HTTPS server and Express.js. It is written in Object-Oriented Programming (OOP) style and includes custom error handling and middleware. The repository includes a simple frontend built with React for demonstration purposes.

# Features
- User registration
- User login
-	Use of bcrypt for password hashing
-	Use of session and cookies for authentication
-	Use of HTTPS with SSL certificates for secure communication
-	Use of environment variables for storing sensitive information
-	Custom error handling and middleware
-	Use of MySQL for storing user information
-	Simple frontend built with React for demonstration purposes

# Getting Started
1.	Clone the repository and install the dependencies by running npm install.
2.	Create a .env file in the backend/secrets directory and add your environment variables (e.g. database credentials, secret for session, etc.).
3.	Generate SSL certificates for HTTPS and place them in the backend/cert directory.
4.	Start the server by running npm start in the root directory. This will start the backend server as well as the frontend.

# Technologies
•	Node.js
•	Express.js
•	MySQL
•	bcrypt
•	dotenv
•	express-session
•	https
•	React.js
