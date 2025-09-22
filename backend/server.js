import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.js";
dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB prisijungta");
    app.listen(PORT, () => console.log("PORT:" + PORT));
  })
  .catch((err) => {
    console.error("MongoDB error:", err.message);
  });
