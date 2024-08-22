import express from "express";
import NotesControllers from "../controllers/note.controller";

export const noteRouter = express.Router();

// get all notes form db or READ
noteRouter.get("/", NotesControllers.handleGetAllNotes);

// post new note to db or CREATE
noteRouter.post("/", NotesControllers.handleCreateNote);

// update note to db or UPDATE
noteRouter.patch("/:id", NotesControllers.handleUpdateNote);

// delete note from db or DELETE
noteRouter.delete("/:id", NotesControllers.handleDeleteNote);
