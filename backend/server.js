import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import bluebird from "bluebird";
import jwt from "jsonwebtoken";

const app = express();
const PORT = 8081;
import * as crypto from "crypto";

const SECRET_KEY = crypto.randomBytes(32).toString("hex");

app.use(cors());
app.use(express.json()); // Parse JSON requests

// MySQL Connection
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
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

const GenerateToken = (userData, expiresIn = "1h") => {
  return jwt.sign(userData, SECRET_KEY, { expiresIn });
};
// Middleware to verify JWT token
const VerifyToken = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
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
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Fetch the user from the database based on the provided email
    const [results] = await db.query(
      "SELECT id, email, first_name, role, password FROM users WHERE email = ?",
      [email]
    );

    if (results.length > 0) {
      const user = results[0];

      // Compare the provided password with the hashed password from the database
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (isPasswordMatch) {
        // Passwords match, generate and send the token back to the client
        const token = GenerateToken({
          id: user.id,
          email: user.email,
          role: user.role,
          first_name: user.first_name,
        });

        res.json({
          token,
          id: user.id,
          email: user.email,
          first_name: user.first_name, // Include first name in the response
          role: user.role,
        });
      } else {
        res.status(400).json({ message: "Invalid email or password" });
      }
    } else {
      res.status(400).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST endpoint for handling edit user requests
app.post("/api/editUser", VerifyToken, async (req, res) => {
  const editedUserData = req.body;

  try {
    // Update the user in the database based on the provided ID
    await db.query("UPDATE users SET ? WHERE id = ?", [
      {
        first_name: editedUserData.first_name,
        last_name: editedUserData.last_name,
        email: editedUserData.email,
        phone_number: editedUserData.phone_number,
        address: editedUserData.address,
        role: editedUserData.role,
      },
      editedUserData.id,
    ]);

    res.json({ message: "User edited successfully" });
  } catch (error) {
    console.error("Error editing user: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST endpoint for handling edit user status requests
// POST endpoint for handling edit user status requests
app.post("/api/editUserStatus", VerifyToken, async (req, res) => {
  const { id, status } = req.body;

  try {
    // Update the user status in the database based on the provided ID
    await db.query("UPDATE users SET status = ? WHERE id = ?", [status, id]);

    res.json({ message: "User status updated successfully" });
  } catch (error) {
    console.error("Error updating user status: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST endpoint for handling delete user requests
app.post("/api/deleteUser", async (req, res) => {
  const userIdToDelete = req.body.id;

  try {
    // Delete the user from the database based on the provided ID
    await db.query("DELETE FROM users WHERE id = ?", [userIdToDelete]);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user: ", error);
    res.status(500).json({ error: "Internal Server Error" });
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

app.get("/api/getUsers", async (req, res) => {
  try {
    const [results] = await pool.query(
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
