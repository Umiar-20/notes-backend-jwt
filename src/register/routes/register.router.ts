import express from "express";
import UserController from "../controllers/register.controller";

export const registerRouter = express.Router();

registerRouter.post("/", UserController.handleRegister);
