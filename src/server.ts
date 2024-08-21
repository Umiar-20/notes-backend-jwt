import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { User } from "../models/user.schema";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { Auth } from "../models/auth.schema";

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
// untuk membaca cookie
app.use(cookieParser());

// Proses register
app.post("/register", async (req, res) => {
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

// Proses login
app.post("/login", async (req, res) => {
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

// Resources Endpoint
app.get("/resources", async (req, res) => {
  const { accessToken, refreshToken } = req.cookies;

  // checking if token exist
  if (accessToken) {
    try {
      jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN as string);
      return res.json({ data: "ini datanya....!" });
    } catch (error) {
      // if didnt exist then regenrate new access token with refresh token
      if (!refreshToken) {
        return res.status(401).json({ message: "please re-login" });
      }

      try {
        // check if refresh token valid or not
        jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN as string);
        // if valid, verify to db
        const activeRefreshToken = await Auth.findOne({
          refreshToken,
        });

        if (!activeRefreshToken) {
          return res.status(401).json({ message: "please re-login" });
        }

        const payload = jwt.decode(refreshToken) as {
          id: String;
          name: String;
          email: String;
        };
        console.log(payload);

        const newAccessToken = jwt.sign(
          {
            id: payload.id,
            name: payload.name,
            email: payload.email,
          },
          process.env.JWT_ACCESS_TOKEN as string,
          { expiresIn: 300 }
        );

        return res
          .cookie("accessToken", newAccessToken, { httpOnly: true })
          .json({ data: "ini datanyaa...!" });
        // regenerate new refresh token
      } catch (error) {
        // if invalid user need to relogin

        return res.status(401).json({ message: "please re-login" });
      }
    }
  }

  // if exist then verify access token

  // console.log({ accessToken, refreshToken });
});

// untuk menjalankan server pada port yang ada dalam env.PORT
app.listen(process.env.PORT, () => {
  console.log(`Server is runnin at port: ${process.env.PORT}`);
});
