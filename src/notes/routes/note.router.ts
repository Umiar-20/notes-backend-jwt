import express from "express";
import { Note } from "../models/note.schema";
import jwt from "jsonwebtoken";
import { Auth } from "../../auth/models/auth.schema";

export const noteRouter = express.Router();

// get all notes form db or READ
noteRouter.get("/", async (_, res) => {
  const allNotes = await Note.find();
  return res.json({ data: allNotes });
});

// post new note to db or CREATE
noteRouter.post("/", async (req, res) => {
  const { title, content } = req.body;
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
        return res.status(401).json({ message: "Unauthorized, please login" });
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
    const createNewNote = new Note({
      title,
      content,
    });

    await createNewNote.save();

    return res
      .status(201)
      .json({ message: "Note created", data: { title, content } });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create note", error });
  }
});

// update note to db or UPDATE
// noteRouter.patch("/:id", async (req, res) => {
//   const { title, content } = req.body;
//   const { accessToken, refreshToken } = req.cookies;
//   const noteId = req.params.id;

//   // check if user has token or not to update a note
//   if (!accessToken && !refreshToken) {
//     return res.status(401).json({ message: "Unauthorized, Please login" });
//   }

//   // update a note logic
//   await Note.findByIdAndUpdate(noteId, {
//     title,
//     content,
//   });

//   return res.json({ message: "you are updating a data...." });
// });
noteRouter.patch("/:id", async (req, res) => {
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
        return res.status(401).json({ message: "Unauthorized, please login" });
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
});

// delete note from db or DELETE
noteRouter.delete("/:id", async (req, res) => {
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
        return res.status(401).json({ message: "Unauthorized, please login" });
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
});
