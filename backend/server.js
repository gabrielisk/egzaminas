import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.js";
import equipmentRoutes from "./routes/equipment.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/equipment", equipmentRoutes);

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
