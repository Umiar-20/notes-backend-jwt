import { model, Schema } from "mongoose";

const schemaOfUser = new Schema({
  name: String,
  email: String,
  password: String,
});

export const User = model("User", schemaOfUser);
