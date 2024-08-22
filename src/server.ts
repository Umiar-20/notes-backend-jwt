import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { User } from "./register/models/user.schema";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { Auth } from "./auth/models/auth.schema";
import { Note } from "./notes/models/note.schema";
import { registerRouter } from "./register/routes/register.router";
import { loginRouter } from "./auth/routes/login.router";
import { logoutRouter } from "./auth/routes/logout.router";
import { noteRouter } from "./notes/routes/note.router";
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
app.use("/register", registerRouter);

// Proses login
app.use("/login", loginRouter);

//  Notes
app.use("/notes", noteRouter);

// Proses logout
app.use("/logout", logoutRouter);

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
