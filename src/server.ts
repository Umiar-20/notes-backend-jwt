import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// untuk membaca json, bersifat WAJIB!!!!
app.use(express.json());

app.get("/", (_, res) => {
  return res.json({ message: "Hello World!" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is runnin at port: ${process.env.PORT}`);
});
