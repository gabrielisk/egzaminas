import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.js";
import equipmentRoutes from "./routes/equipment.js";
import reservationsRoutes from "./routes/reservations.js";
import equipmentAdminRoutes from "./routes/equipmentAdmin.js";
import reservationsAdminRoutes from "./routes/reservationsAdmin.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/reservations", reservationsRoutes);
app.use("/api/equipment-admin", equipmentAdminRoutes);
app.use("/api/reservations-admin", reservationsAdminRoutes);

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
