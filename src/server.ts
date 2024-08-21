import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { User } from "../models/user.schema";
import jwt from "jsonwebtoken";

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

// untuk menggunakan express
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

  return res.json({ message: "Register Success!!", data });
});

// Proses login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // input validation
  if (!email || password.length < 8) {
    return res.json({
      message: "email invalid and password must be more than 8 characters!",
    });
  }

  // find user
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "user not found!" });
  }

  return res.status(200).json({ message: "login success!" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is runnin at port: ${process.env.PORT}`);
});
