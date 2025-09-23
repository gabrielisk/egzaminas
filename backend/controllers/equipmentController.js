import Equipment from "../models/equipmentModel.js";

export async function listEquipment(req, res) {
  try {
    const items = await Equipment.find({ status: "paskelbta" }).sort({
      createdAt: -1,
    });
    res.json(items);
  } catch {
    res.status(500).json({ error: "Nepavyko gauti įrangos sąrašo" });
  }
}

export async function getEquipmentById(req, res) {
  const { id } = req.params;
  try {
    const item = await Equipment.findById(id);
    if (!item || item.status !== "paskelbta")
      return res.status(404).json({ error: "Įranga nerasta" });
    res.json(item);
  } catch {
    res.status(404).json({ error: "Įranga nerasta" });
  }
}
