import { model, Schema } from "mongoose";

const schemaOfAuth = new Schema({
  userId: String,
  refreshToken: String,
});

export const Auth = model("Auth", schemaOfAuth);
