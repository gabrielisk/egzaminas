import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB prisijungta");
    app.listen(PORT, () => console.log("PORT:" + PORT));
  })
  .catch((err) => {
    console.error("MongoDB error:", err.message);
    process.exit(1);
  });
