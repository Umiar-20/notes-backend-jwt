import { model, Schema } from "mongoose";

const schemaOfNote = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

export const Note = model("Note", schemaOfNote);
