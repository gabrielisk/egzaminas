import Equipment from "../models/equipmentModel.js";

export async function adminListEquipment(req, res) {
  try {
    const irangosSarasas = await Equipment.find().sort({ createdAt: -1 });
    return res.json(irangosSarasas);
  } catch {
    return res.status(500).json({ error: "Nepavyko gauti sąrašo" });
  }
}

export async function adminCreateEquipment(req, res) {
  const {
    title,
    description = "",
    images = [],
    status = "Juodraštis",
  } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Trūksta pavadinimo" });
  }

  try {
    const sukurtaIranga = await Equipment.create({
      title: title.trim(),
      description,
      images,
      status,
    });
    return res.status(201).json(sukurtaIranga);
  } catch (e) {
    return res.status(400).json({ error: e.message || "Nepavyko sukurti" });
  }
}
