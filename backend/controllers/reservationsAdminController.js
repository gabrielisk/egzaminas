import mongoose from "mongoose";
import Reservation from "../models/reservationModel.js";

const ALLOWED = ["Laukiama", "Patvirtinta", "Vykdoma", "Atmesta"];

export async function adminListReservations(req, res) {
  try {
    const sarasas = await Reservation.find().sort({ createdAt: -1 });
    return res.json(sarasas);
  } catch {
    return res.status(500).json({ error: "Nepavyko gauti sąrašo" });
  }
}
export async function adminChangeReservationStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Neteisingas ID" });
  }
  if (!ALLOWED.includes(status)) {
    return res.status(400).json({ error: "Neleistinas statusas" });
  }

  try {
    const atnaujinta = await Reservation.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!atnaujinta)
      return res.status(404).json({ error: "Rezervacija nerasta" });
    return res.json(atnaujinta);
  } catch {
    return res.status(400).json({ error: "Nepavyko pakeisti statuso" });
  }
}
