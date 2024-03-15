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
<<<<<<< HEAD
import { checkEmail } from "./component/checkemail.js";
import getJoinedClientData from "./component/getJoinedClientData.js";
import deleteClient from "./component/deleteClient.js";
import editClient from "./component/editclient.js";
const app = express();
const PORT = 8081;
const router = express.Router();
app.use(express.json());
=======
import updateProfileProfile from "./component/editProfilePicture.js";

const app = express();
const PORT = 8081;
const router = express.Router();
const SECRET_KEY = "k0PJbIobltNQ4zlgiu_Gtpo0iZVQ9IytOsjR7so9CoM";

app.use(bodyParser.json());
>>>>>>> 4fb2d8a0c7022d34ffa149eccf0930f22c4f8d4b
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

const upload = multer({ storage });

app.post(
  "/api/upload",
<<<<<<< HEAD
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
        "SELECT profile_picture_url FROM users WHERE id = ?",
        [id]
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
=======
  decodeTokenMiddleware,
  upload.single("image"),
  async (req, res) => {
    await updateProfileProfile(db, req, res);
>>>>>>> 4fb2d8a0c7022d34ffa149eccf0930f22c4f8d4b
  }
);
app.post("/api/login", async (req, res) => {
  await Login(db, req, res);
});

app.get("/api/getUsers", async (req, res) => {
  await Getuser(req, res);
});

app.get("/api/getRole/:id", async (req, res) => {
  await Getrole(req, res);
});
app.post("/api/editUserStatus", async (req, res) => {
  await EditUserStatus(db, req, res);
});

app.post("/api/editUser", async (req, res) => {
  await EditUser(db, req, res);
});


app.post("/api/addclient", async (req, res) => {
  await AddClient(db,req, res);
});
app.get("/api/getJoinedClientData", async (req, res) => {
  await getJoinedClientData(db, req, res);
});


app.get("/api/checkemail", async (req, res) => {
  await checkEmail(db, req, res);
});

app.post("/api/deleteClient", async (req, res) => {
  await deleteClient( db,req, res);
});
app.post("/api/deleteUser", async (req, res) => {
  await DeleteUser(db, req, res);
});
app.post("/api/editClient", async (req, res) => {
  await editClient(db, req, res);
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
