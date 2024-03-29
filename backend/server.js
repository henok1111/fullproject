// server.js

import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import bluebird from "bluebird";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { promisify } from "util";
import AddClient from "./component/addclient.js";
import AddAdvocator from "./component/addadvocator.js";
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
import uploadImage from "./component/uploadimage.js";
import getUserImage from "./component/getuserimage.js";
import EditSpecificUser from "./component/editspecificuser.js";
import GetCases from "./component/getcase.js";
import { GetPetitioners,GetRespondents } from "./component/getpetionerandrespondant.js";
import { AddAppointment } from "./component/addappointment.js";
import getAdvocatorData from "./component/getadvocators.js";
import editAdvocator from "./component/editadvocator.js";
import deleteAdvocator from "./component/deleteadvocator.js";
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
app.use(express.static("uploads"));
app.use(express.urlencoded({ extended: true }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
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

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const uploadFolder = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder);
    }
    cb(null, uploadFolder); // Save files in the "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Generate unique filenames
  },
});

const upload = multer({ storage: storage });

// Handle file upload route
app.post("/api/upload", upload.single("file"), (req, res) =>
  uploadImage(db, req, res)
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
app.get("/api/getUserImage/:userId", (req, res) => {
  getUserImage(db, req, res); // Call getUserImage function with db, req, and res parameters
});

app.post("/api/addclient", async (req, res) => {
  await AddClient(db, req, res);
});
app.post("/api/addadvocator", async (req, res) => {
  await AddAdvocator(db, req, res);
});

app.post("/api/addappointments", async (req, res) => {
  await AddAppointment(db, req, res);
});
app.get("/api/getJoinedClientData", async (req, res) => {
  await getJoinedClientData(db, req, res);
});
app.get("/api/getAdvocatorData", async (req, res) => {
  await getAdvocatorData(db, req, res);
});
app.get("/api/checkemail", async (req, res) => {
  await checkEmail(db, req, res);
});
app.get("/api/checkuseremail", async (req, res) => {
  await checkEmail(db, req, res);
});
app.post("/api/deleteClient", async (req, res) => {
  await deleteClient(db, req, res);
});

app.post("/api/deleteadvocator", async (req, res) => {
  await deleteAdvocator(db, req, res);
});
app.post("/api/deleteUser", async (req, res) => {
  await DeleteUser(db, req, res);
});
app.post("/api/editClient", async (req, res) => {
  await editClient(db, req, res);
});
app.post("/api/editAdvocator", async (req, res) => {
  await editAdvocator(db, req, res);
});
app.post("/api/adduser", async (req, res) => {
  await AddUser(db, req, res);
});
app.get("/api/cases", async (req, res) => {
  await GetCases(req, res); // Call GetCases function with req and res parameters
});
app.post("/api/updateUser/:userId", async (req, res) => {
  await EditSpecificUser(db, req, res);
});
app.get("/api/petitioners/:caseId", async (req, res) => {
  await GetPetitioners(db, req, res);
});

app.get("/api/respondents/:caseId", async (req, res) => {
  await GetRespondents(db, req, res);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
