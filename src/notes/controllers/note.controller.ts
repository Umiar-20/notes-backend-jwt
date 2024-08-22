import type { Request, Response } from "express";
import { Note } from "../models/note.schema";
import jwt from "jsonwebtoken";
import { Auth } from "../../auth/models/auth.schema";
import NoteServices from "../services/note.services";

const NotesControllers = {
  handleGetAllNotes: async (req: Request, res: Response) => {
    //bussiness logic
    const allNotes = await NoteServices.getAll();
    return res.json({ data: allNotes });
  },

  handleCreateNote: async (req: Request, res: Response) => {
    const { title, content } = req.body;
    const { accessToken, refreshToken } = req.cookies;

    return await NoteServices.create(
      title,
      content,
      accessToken,
      refreshToken,
      res
    );
  },

  handleUpdateNote: async (req: Request, res: Response) => {
    const { title, content } = req.body;
    const { accessToken, refreshToken } = req.cookies;
    const noteId = req.params.id;

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

    // Proceed with updating the note if accessToken is valid
    try {
      await Note.findByIdAndUpdate(noteId, {
        title,
        content,
      });

      return res.json({ message: "Note updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to update note", error });
    }
  },

  handleDeleteNote: async (req: Request, res: Response) => {
    const noteId = req.params.id;
    const { accessToken, refreshToken } = req.cookies;

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

        // Continue with the delete operation
        const deleteNote = await Note.findByIdAndDelete(noteId);
        console.log({ deleteNote });
        return res.json({ message: "delete success" });
      } catch (error) {
        return res.status(401).json({ message: "Unauthorized, please login" });
      }
    }

    // Perform delete operation if accessToken is valid
    try {
      const deleteNote = await Note.findByIdAndDelete(noteId);
      console.log({ deleteNote });
      return res.json({ message: "delete success" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete note", error });
    }
  },
};

export default NotesControllers;
