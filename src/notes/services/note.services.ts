import jwt from "jsonwebtoken";
import NoteRepository from "../repositories/note.repository";
import { Response } from "express";
import { Auth } from "../../auth/models/auth.schema";

const NoteServices = {
  getAll: async () => {
    try {
      // input validation
      const allNotes = await NoteRepository.getAll();

      // filter by DTO
      return allNotes;
    } catch (error) {
      console.log("Book service error: ", error);
    }
  },

  create: async (
    title: string,
    content: string,
    accessToken: string,
    refreshToken: string,
    res: Response
  ) => {
    // Check if tokens exist
    if (!accessToken && !refreshToken) {
      return res.status(401).json({ message: "Unauthorized, please login" });
    }

    try {
      // Verify the access token
      jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN as string);
    } catch (error) {
      // If access token is invalid or expired, check the refresh token
      if (!refreshToken) {
        return res.status(401).json({ message: "Unauthorized, please login" });
      }

      try {
        // Verify the refresh token
        jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN as string);

        // Check if the refresh token exists in the database
        const activeRefreshToken = await Auth.findOne({ refreshToken });
        if (!activeRefreshToken) {
          return res
            .status(401)
            .json({ message: "Unauthorized, please login" });
        }

        // Decode the payload from the refresh token
        const payload = jwt.decode(refreshToken) as {
          id: string;
          name: string;
          email: string;
        };

        // Generate a new access token
        const newAccessToken = jwt.sign(
          {
            id: payload.id,
            name: payload.name,
            email: payload.email,
          },
          process.env.JWT_ACCESS_TOKEN as string,
          { expiresIn: 300 } // Set a short expiration for the new access token
        );

        // Set the new access token in the cookies
        res.cookie("accessToken", newAccessToken, { httpOnly: true });
      } catch (error) {
        return res.status(401).json({ message: "Unauthorized, please login" });
      }
    }

    // Proceed with creating the new note if accessToken is valid
    try {
      const newNote = await NoteRepository.create(title, content);
      return res.status(201).json({ message: "Note created", data: newNote });
    } catch (error) {
      return res.status(500).json({ message: "Failed to create note", error });
    }
  },

  update: async () => {},

  delete: async () => {},
};

export default NoteServices;
