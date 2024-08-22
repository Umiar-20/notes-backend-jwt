import express from "express";
import { Auth } from "../models/auth.schema";

export const logoutRouter = express.Router();

logoutRouter.post("/", async (req, res) => {
  const { refreshToken } = req.cookies;

  // delete token di db
  await Auth.findOneAndDelete({ refreshToken });

  return res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json({ message: "logout berhasil!" });
});
