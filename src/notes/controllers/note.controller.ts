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

    return await NoteServices.update(
      noteId,
      title,
      content,
      accessToken,
      refreshToken,
      res
    );
  },

  handleDeleteNote: async (req: Request, res: Response) => {
    const noteId = req.params.id;
    const { accessToken, refreshToken } = req.cookies;

    return await NoteServices.delete(noteId, accessToken, refreshToken, res);
  },
};

export default NotesControllers;
