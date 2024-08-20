import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { User } from "../models/user.schema";

dotenv.config();

// koneksi mongodb
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() =>
    console.log("MongoDB Connected yessssssssssssssssssssssssssssssssss")
  )
  .catch((error) => {
    console.log("MongoDB Connection Failed");
    console.error(error);
  });

const app = express();

// untuk membaca json, bersifat WAJIB!!!!
app.use(express.json());

// Proses register
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // hash password
  const hashingPassword = await bcrypt.hash(password, 13);

  // payload
  const newUser = {
    name,
    email,
    password: hashingPassword,
  };

  const newCreatedUser = new User(newUser);
  const data = await newCreatedUser.save();

  return res.json({ message: "Register Success!!", data: data });
});

// Proses login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // checking password from login page
  const checkPassword = await bcrypt.compare(password, "....");

  if (!checkPassword) {
    return res.status(403).json({ message: "Invalid Credentials" });
  }

  // authorization with (JWT/session)
});

app.listen(process.env.PORT, () => {
  console.log(`Server is runnin at port: ${process.env.PORT}`);
});
