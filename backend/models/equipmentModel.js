import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    images: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["Juodraštis", "Paskelbta"],
      default: "Juodraštis",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Equipment", equipmentSchema);
