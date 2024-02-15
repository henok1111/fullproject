<<<<<<< HEAD
import express from "express";
import cors from "cors";
import mysql from "mysql2";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import bluebird from "bluebird";

=======
import express from 'express';
import cors from 'cors';
import mysql from 'mysql';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
>>>>>>> henok
const app = express();
const PORT = 8081;
import * as crypto from 'crypto';


app.use(cors());
app.use(bodyParser.json()); // Parse JSON requests

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "court",
  Promise: bluebird,
});

db.connect((err) => {
  if (err) {
<<<<<<< HEAD
    console.error("Database connection failed: ", err);
=======
    console.error('Database connection failed: ', err);
    return res.status(500).json({ error: 'Database Connection Error' });
>>>>>>> henok
  } else {
    console.log("Connected to the database");
  }
});
const generateToken = (userData) => {
  return jwt.sign(userData, SECRET_KEY, { expiresIn: '1h' });
};
// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};
// POST endpoint for receiving form data
app.post("/api/createUser", async (req, res) => {
  const userData = req.body;

  // Hash the password before storing it in the database
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  // Do not store 'confirm_password' in the database

  // Update the query to use the hashed password
  db.query(
    "INSERT INTO users SET ?",
    {
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      phone_number: userData.phone_number,
      address: userData.address,
      password: hashedPassword,
      role: userData.role,
      status: "activated", // Assuming the default status is activated for a new user
    },
    (error, results) => {
      if (error) {
        console.error("Error creating user: ", error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json({
          message: "User created successfully",
          userId: results.insertId,
        });
      }
    }
  );
});

// POST endpoint for handling login requests
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  // Fetch the user from the database based on the provided email
<<<<<<< HEAD
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (error, results) => {
      if (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal Server Error" });
=======
  db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
    if (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (results.length > 0) {
        const user = results[0];

        // Compare the provided password with the hashed password from the database
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (isPasswordMatch) {
          // Passwords match, generate a JWT token
          const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, '139bbe98c5f479524fff9b4c132ed50d6b816c3b209a735a0d2bfdc5416d5295', { expiresIn: '1h' });
          // Send the token back to the client
          res.json({
            token,
            id: user.id,
            email: user.email,
            role: user.role,
          });
        } else {
          // Passwords do not match
          res.status(400).json({ message: 'Invalid email or password' });
        }
>>>>>>> henok
      } else {
        if (results.length > 0) {
          const user = results[0];

          // Compare the provided password with the hashed password from the database
          const isPasswordMatch = await bcrypt.compare(password, user.password);

          if (isPasswordMatch) {
            // Passwords match, send the user information back to the client
            res.json({
              id: user.id,
              email: user.email,
              role: user.role,
            });
          } else {
            // Passwords do not match
            res.status(400).json({ message: "Invalid email or password" });
          }
        } else {
          // User with the provided email not found
          res.status(400).json({ message: "Invalid email or password" });
        }
      }
    }
  );
});


// POST endpoint for handling edit user requests
app.post("/api/editUser", async (req, res) => {
  const editedUserData = req.body;

  // Update the user in the database based on the provided ID
  db.query(
    "UPDATE users SET ? WHERE id = ?",
    [
      {
        first_name: editedUserData.first_name,
        last_name: editedUserData.last_name,
        email: editedUserData.email,
        phone_number: editedUserData.phone_number,
        address: editedUserData.address,
        role: editedUserData.role,
      },
      editedUserData.id,
    ],
    (error) => {
      if (error) {
        console.error("Error editing user: ", error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json({ message: "User edited successfully" });
      }
    }
  );
});

// POST endpoint for handling edit user status requests
app.post("/api/editUserStatus", (req, res) => {
  const { id, status } = req.body;

  // Update the user status in the database based on the provided ID
  db.query(
    "UPDATE users SET status = ? WHERE id = ?",
    [status, id],
    (error) => {
      if (error) {
        console.error("Error updating user status: ", error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json({ message: "User status updated successfully" });
      }
    }
  );
});

// POST endpoint for handling delete user requests
app.post("/api/deleteUser", async (req, res) => {
  const userIdToDelete = req.body.id;

  // Delete the user from the database based on the provided ID
  db.query("DELETE FROM users WHERE id = ?", [userIdToDelete], (error) => {
    if (error) {
      console.error("Error deleting user: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json({ message: "User deleted successfully" });
    }
  });
});

// GET endpoint to retrieve users
app.get("/api/getUsers", (req, res) => {
  // Perform a database query to get all users from the 'users' table including 'id'
  db.query(
    "SELECT id, first_name, last_name, email, phone_number, address, role, status FROM users",
    (error, results) => {
      if (error) {
        console.error("Error fetching users: ", error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(results);
      }
    }
  );
});

app.get('/api/userDetails/:userId', (req, res) => {
  const userId = req.params.userId;

  // Query the database to fetch user details
  const query = 'SELECT first_name FROM users WHERE id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user details from database:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        const user = results[0];
        res.json({ firstName: user.first_name }); // Wrap the result in a JSON object
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
