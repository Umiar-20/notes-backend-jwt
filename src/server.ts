import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();

// untuk membaca json, bersifat WAJIB!!!!
app.use(express.json());

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // hash password
  const hashingPassword = await bcrypt.hash(password, 13);

  // mock data yang akan dimasukkan ke database
  const newUser = {
    name,
    email,
    password: hashingPassword,
  };

  return res.json({ message: newUser });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is runnin at port: ${process.env.PORT}`);
});
