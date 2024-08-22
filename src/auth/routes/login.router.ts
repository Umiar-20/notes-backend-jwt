import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Auth } from "../models/auth.schema";
import { User } from "../../register/models/user.schema";

export const loginRouter = express.Router();

loginRouter.post("/", async (req, res) => {
  const { email, password } = req.body;

  // input validation
  if (!email || password.length < 8) {
    return res.json({
      message: "email invalid and password must be more than 8 characters!",
    });
  }

  // find user by email
  const user = await User.findOne({ email });

  // jika user dengan email tidak ada dalam db
  if (!user) {
    return res.status(404).json({ message: "user not found!" });
  }

  // password validation
  const isPasswordMatch = await bcrypt.compare(
    password,
    user.password as string
  );

  if (!isPasswordMatch) {
    return res.status(400).json({ message: "invalid Password!" });
  }

  // Authorization
  const payload = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  const accessToken = jwt.sign(
    payload,
    process.env.JWT_ACCESS_TOKEN as string,
    {
      expiresIn: 300,
    }
  ); // token expires in 30 seconds

  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_TOKEN as string,
    {
      expiresIn: "3d",
    }
  );

  const newRefreshToken = new Auth({
    userId: user.id,
    refreshToken,
  });
  await newRefreshToken.save();

  return res
    .cookie("accessToken", accessToken, { httpOnly: true })
    .cookie("refreshToken", refreshToken, { httpOnly: true })
    .status(200)
    .json({ message: "login success!" });
});
