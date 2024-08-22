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

  // inset note to db
  const createNewNote = new Note({
    title,
    content,
  });

  await createNewNote.save();

  return res.json({ data: { title, content } });
});

// update note to db or UPDATE
noteRouter.patch("/:id", async (req, res) => {
  const authKey = req.headers.authorization;
  console.log(authKey);

  return res.json({ message: "you are updating a data...." });
});

// delete note from db or DELETE
noteRouter.delete("/:id", async (req, res) => {
  const noteId = req.params.id;
  const { accessToken, refreshToken } = req.cookies;
  const deleteNote = await Note.findByIdAndDelete(noteId);

  // checking if token exist
  if (accessToken) {
    try {
      jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN as string);
      console.log({ deleteNote });
      return res.json({ message: "delete success" });
    } catch (error) {
      // if didnt exist then regenrate new access token with refresh token
      if (!refreshToken) {
        return res.status(401).json({ message: "Unauthorized, please login" });
      }

      try {
        // check if refresh token valid or not
        jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN as string);
        // if valid, verify to db
        const activeRefreshToken = await Auth.findOne({
          refreshToken,
        });

        if (!activeRefreshToken) {
          return res
            .status(401)
            .json({ message: "Unauthorized, please login" });
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

        console.log({ deleteNote });
        return res
          .cookie("accessToken", newAccessToken, { httpOnly: true })
          .json({ message: "delete success" });
        // regenerate new refresh token
      } catch (error) {
        // if invalid user need to relogin

        return res.status(401).json({ message: "Unauthorized, please login" });
      }
    }
  }

  // logic untuk delete note pada db
  // const deleteNote = await Note.findByIdAndDelete(noteId);
  // console.log({ deleteNote });

  // return res.json({ message: "delete success" });
});
