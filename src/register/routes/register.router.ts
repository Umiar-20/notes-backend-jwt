import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user.schema";

export const registerRouter = express.Router();

registerRouter.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  // input validation

  // hash password
  const hashingPassword = await bcrypt.hash(password, 13);

  // payload untuk menampung sementara data user baru sebelum dimasukkan ke db
  const newUser = {
    name,
    email,
    password: hashingPassword,
  };

  // insert to db
  const newCreatedUser = new User(newUser);
  const data = await newCreatedUser.save();

  return res.status(201).json({ message: "Register Success!!", data });
});
