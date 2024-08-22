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
  update: async () => {},
  delete: async () => {},
};

export default NoteRepository;
