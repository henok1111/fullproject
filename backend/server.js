import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import bluebird from "bluebird";
import jwt from "jsonwebtoken";

const app = express();
const PORT = 8081;
const SECRET_KEY = "k0PJbIobltNQ4zlgiu_Gtpo0iZVQ9IytOsjR7so9CoM";

app.use(bodyParser.json());
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
app.use(express.json()); // Parse JSON requests

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
// Middleware to verify JWT token
const VerifyToken = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.substring(7); // Remove "Bearer " prefix

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;

    // Check if the user's role is allowed for the requested page
    const allowedRoles = getRolesForRoute(req.path); // Implement this function
    if (!allowedRoles.includes(decoded.role)) {
      // Redirect to unauthorized page
      return res.redirect("/unauthorized");
    }

    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(403).json({ message: "Invalid token" });
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
    const { id, first_name, role, status } = userResults[0];

    // If role_name is null, assign it as 'student'
    const userRole = role;

    // Generate a JWT token for authentication with additional user information
    const token = jwt.sign(
      { userId: id, first_name, email, role_name: userRole, status },
      SECRET_KEY,
      { expiresIn: "30m" }
    );

    // Send the token as a response to the client along with user information
    res.status(200).json({
      success: true,
      token,
      user: { id, first_name, email, role_name: userRole, status },
    });
  } catch (error) {
    console.error("Error in login route:", error);
    res.status(500).json({ success: false, message: "Login failed" });
  }
});


// GET endpoint to retrieve users
app.get("/api/getUsers", async (req, res) => {
  try {
    const [results] = await global.pool.query(
      "SELECT id, first_name, last_name, email, phone_number, address, role, status FROM users"
    );
    res.json(results);
  } catch (error) {
    console.error("Error fetching users: ", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
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


// Endpoint to edit user
app.post("/api/editUser", async (req, res) => {
  try {
    const userData = req.body;

    // Log the received user information
    console.log("Received edit user request with data:", userData);

    // Your existing logic for editing the user
    const [result] = await global.pool.query(
      "UPDATE users SET first_name = ?, last_name = ?, email = ?, phone_number = ?, address = ?, role = ? WHERE id = ?",
      [
        userData.first_name,
        userData.last_name,
        userData.email,
        userData.phone_number,
        userData.address,
        userData.role,
        userData.id,
      ]
    );

    res.status(200).json({ message: "User edited successfully!" });
  } catch (error) {
    console.error("Error editing user: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Endpoint to delete user
app.post("/api/deleteUser", async (req, res) => {
  try {
    const userId = req.body.id;

    // Log the received user ID
    console.log(`Received delete request for user ID: ${userId}`);

    // Your existing logic for deleting the user
    const [result] = await global.pool.query(
      "DELETE FROM users WHERE id = ?",
      [userId]
    );

    res.json({ message: `User with ID ${userId} deleted successfully!` });
  } catch (error) {
    console.error("Error deleting user: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// Endpoint to edit user status
app.post("/api/editUserStatus", async (req, res) => {
  try {
    const userId = req.body.id;
    const newStatus = req.body.status;

    // Log the received user ID and new status
    console.log(`Received edit user status request for user ID ${userId} with new status: ${newStatus}`);

    // Your existing logic for editing user status
    const [result] = await global.pool.query(
      "UPDATE users SET status = ? WHERE id = ?",
      [newStatus, userId]
    );

    res.json({ message: `User with ID ${userId} status updated successfully!` });
  } catch (error) {
    console.error("Error updating user status: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
