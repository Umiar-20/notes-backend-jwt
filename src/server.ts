import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();

// untuk membaca json, bersifat WAJIB!!!!
app.use(express.json());

app.post("/register", (req, res) => {
  console.log(req.body);
  return res.json({ message: req.body });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is runnin at port: ${process.env.PORT}`);
});
