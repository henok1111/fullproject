import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import bodyParser from "body-parser";
import bluebird from "bluebird";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { promisify } from "util";
import AddClient from "./component/addclient.js";
import AddUser from "./component/adduser.js";
import Login from "./login.js";
import Getuser from "./component/getuser.js";
import Getrole from "./component/getrole.js";
import EditUser from "./component/EditUser.js";
import DeleteUser from "./component/deleteUser.js";
import EditUserStatus from "./component/EditUserStatus.js";
import { checkEmail } from "./component/checkemail.js";
import getJoinedClientData from "./component/getJoinedClientData.js";
import deleteClient from "./component/deleteClient.js";
import editClient from "./component/editclient.js";
const app = express();
const PORT = 8081;
const router = express.Router();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST", "GET", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Origin",
      "X-Requested-With",
      "Accept",
      "x-client-key",
      "x-client-token",
      "x-client-secret",
      "Authorization",
    ],
    credentials: true,
  })
);
 // Parse JSON requests
app.use(express.static("uploads"));
app.use(express.urlencoded({ extended: true }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// MySQL Connection
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "court",
  Promise: bluebird,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection()
  .then((connection) => {
    console.log("Connected to the database");
    global.pool = bluebird.promisifyAll(connection);
  })
  .catch((err) => {
    console.error("Database connection failed: ", err);
  });

const decodeTokenMiddleware = (req, res, next) => {
  // Check if 'Authorization' header exists
  if (!req.headers.authorization) {
    console.error("Authorization header missing");
    return res
      .status(401)
      .json({ status: "error", message: "Authorization header missing" });
  }

  // Extract the token from the 'Authorization' header
  const token = req.headers.authorization.split(" ")[1];
  console.log("Token on the Backend:", token);

  try {
    // Decode the token and extract user information
    const decodedToken = jwt.verify(token, SECRET_KEY);

    if (decodedToken && decodedToken.userId) {
      req.user = {
        userId: decodedToken.userId,
        name: decodedToken.name,
        email: decodedToken.email,
        // Add any other user information you need
      };

      next(); // Move to the next middleware or route handler
    } else {
      console.log("Failed to decode token or extract user information");
      return res.status(401).json({
        status: "error",
        message: "Failed to decode token or extract user information",
      });
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    return res
      .status(401)
      .json({ status: "error", message: "Error decoding token" });
  }
};

// POST endpoint for receiving form data
app.post("/api/createUser", async (req, res) => {
  const userData = req.body;

  try {
    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Do not store 'confirm_password' in the database

    // Update the query to use the hashed password
    const [results] = await db.query("INSERT INTO users SET ?", {
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      phone_number: userData.phone_number,
      address: userData.address,
      password: hashedPassword,
      role: userData.role,
      status: "activated", // Assuming the default status is activated for a new user
    });

    res.json({
      message: "User created successfully",
      userId: results.insertId,
    });
  } catch (error) {
    console.error("Error creating user: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST endpoint for handling login requests
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists with the provided email
    const userQuery = "SELECT * FROM users WHERE email = ?";

    const [userResults] = await db.query(userQuery, [email]);

    if (userResults.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Compare the provided password with the hashed password in the database
    const isValidPassword = await bcrypt.compare(
      password,
      userResults[0].password
    );

    if (!isValidPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    // Extract user information
    const { id, first_name, role } = userResults[0];

    // If role_name is null, assign it as 'student'
    const userRole = role;

    // Generate a JWT token for authentication with additional user information
    const token = jwt.sign(
      { userId: id, first_name, email, role_name: userRole },
      SECRET_KEY,
      { expiresIn: "30m" }
    );

    // Send the token as a response to the client along with user information
    res.status(200).json({
      success: true,
      token,
      user: { id, first_name, email, role_name: userRole },
    });
  } catch (error) {
    console.error("Error in login route:", error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
});

// GET endpoint to retrieve users
app.get("/api/getUsers", async (req, res) => {
  await Getuser(req, res);
});

app.get("/api/getRole/:id", async (req, res) => {
  await Getrole(req, res);
});
app.post("/api/editUserStatus", async (req, res) => {
  await EditUserStatus(db, req, res);
});

app.get("/api/getRole/:id", (req, res) => {
  const { id } = req.params;

  // Parse the id to ensure it is a valid integer
  const userId = parseInt(id, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  // Query the database to fetch the user's role based on the provided ID
  const query = "SELECT role FROM users WHERE id = ?";

  db.query(query, [userId])
    .then(([results]) => {
      if (results.length > 0) {
        const role = results[0].role;
        res.json({ role });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    })
    .catch((err) => {
      console.error("Error fetching role from database:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
