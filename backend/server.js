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

import AddUser from "./component/adduser.js";
import Login from "./login.js";
import Getuser from "./component/getuser.js";
import Getrole from "./component/getrole.js";
import router from "./component/userroutes.js";

const app = express();
const PORT = 8081;

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
app.use(express.static("uploads"));
app.use(express.urlencoded({ extended: true }));

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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const uploadFolder = path.join(__dirname, "uploads");
    // Create the 'uploads' folder if it doesn't exist
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder);
    }
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const saveProfilePicture = async (userId, profilePicture) => {
  try {
    // Check if userId and profilePicture are defined
    if (userId === undefined || profilePicture === undefined) {
      throw new Error("userId and profilePicture must be defined");
    }

    const [result] = await db.execute(
      "UPDATE users SET profile_picture_url = ? WHERE id = ?",
      [profilePicture, userId]
    );

    return result;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error; // Propagate the error to the calling function
  }
};

const upload = multer({ storage });

app.post(
  "/api/upload",
  upload.single("profilePicture"),
  async (db, req, res) => {
    try {
      // console.log('Received update request:', req.body);

      const { id, first_name, email } = req.body;
      const role_name = req.body.role;
      //console.log(role_name)
      const image = req.file ? req.file.filename : null;

      // Use the MySQL connection pool to execute queries
      const query = promisify(db.query).bind(db);
      const currentImageResult = await query(
        "SELECT profile_picture_url FROM users WHERE user_id = ?",
        [user_id]
      );
      const currentImage = currentImageResult[0]
        ? currentImageResult[0].image
        : null;

      // Update the user record
      await query(
        "UPDATE users SET profile_picture_url = IFNULL(?, profile_picture_url) WHERE user_id = ?",
        [email, first_name, role_name, image, id]
      );
      console.log(role_name);
      if (role_name === "Student") {
        // If the role is changed to 'Instructor', delete from students table and insert into instructors table
        await query("DELETE FROM instructors WHERE user_id = ?", [user_id]);
        await query("INSERT INTO students (user_id) VALUES (?)", [user_id]);
      }

      res.status(200).json({ message: "User data updated successfully" });
    } catch (error) {
      //console.error('Error updating user profile:', error);
      res
        .status(500)
        .json({ error: "An error occurred while updating user profile" });
    }
  }
);

app.post("/api/createUser", async (req, res) => {
  await AddUser(db, req, res);
}),
  app.post("/api/login", async (req, res) => {
    await Login(db, req, res);
  });

app.get("/api/getUsers", async (req, res) => {
  await Getuser(req, res);
});

app.get("/api/getRole/:id", async (req, res) => {
  await Getrole(req, res);
});

app.use("/api/user", router);

app.get("/api/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const user = rows[0];
    res.json({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      // Add other fields as needed
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch user details" });
  }
});

// New route for updating user details
app.put("/api/user/update/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = req.body;

    // Perform the update in the database
    await pool.query("UPDATE users SET ? WHERE id = ?", [updatedUser, userId]);

    res.json({ success: true, message: "User details updated successfully" });
  } catch (error) {
    console.error("Error updating user details:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update user details" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
