import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();

// untuk membaca json, bersifat WAJIB!!!!
app.use(express.json());

// Proses register
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

// Proses login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // checking password from login page
  const checkPassword = await bcrypt.compare(password, "....");

  if (!checkPassword) {
    return res.status(403).json({ message: "Invalid Credentials" });
  }

  // authorization with (JWT/session)
});

app.listen(process.env.PORT, () => {
  console.log(`Server is runnin at port: ${process.env.PORT}`);
});
