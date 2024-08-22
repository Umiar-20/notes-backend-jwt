import { Note } from "../models/note.schema";

const NoteRepository = {
  getAll: async () => {
    try {
      const allNotes = await Note.find();
      return allNotes;
    } catch (error) {
      console.log(error);
    }
  },

  create: async (title: string, content: string) => {
    try {
      const newNote = new Note({ title, content });
      await newNote.save();
      return newNote;
    } catch (error) {
      console.log("Error creating note:", error);
      throw error;
    }
  },

  update: async (noteId: string, title: string, content: string) => {
    try {
      const updatedNote = await Note.findByIdAndUpdate(
        noteId,
        { title, content },
        { new: true }
      );
      return updatedNote;
    } catch (error) {
      console.error("Error updating note:", error);
      throw error;
    }
  },

  delete: async (noteId: string) => {
    try {
      const deletedNote = await Note.findByIdAndDelete(noteId);
      return deletedNote;
    } catch (error) {
      console.error("Error deleting note:", error);
      throw error;
    }
  },
};

export default NoteRepository;
