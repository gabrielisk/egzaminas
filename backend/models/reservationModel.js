import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true,
    },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    status: {
      type: String,
      enum: ["laukiama", "patvirtinta", "atmesta", "vykdoma"],
      default: "laukiama",
    },
  },
  { timestamps: true }
);

reservationSchema.pre("validate", function (next) {
  if (!this.start || !this.end) return next(new Error("Neteisingos datos"));
  if (this.start >= this.end)
    return next(new Error("Pradžia turi būti anksčiau nei pabaiga"));
  if (this.start < new Date())
    return next(new Error("Negalima rezervuoti į praeitį"));
  next();
});

export default mongoose.model("Reservation", reservationSchema);
