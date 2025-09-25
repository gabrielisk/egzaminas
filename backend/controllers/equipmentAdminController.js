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

export async function adminUpdateEquipment(req, res) {
  const { id } = req.params;
  const { title, description, images, status } = req.body;

  try {
    const iranga = await Equipment.findById(id);
    if (!iranga) return res.status(404).json({ error: "Įranga nerasta" });

    if (title !== undefined) iranga.title = title;
    if (description !== undefined) iranga.description = description;
    if (images !== undefined) iranga.images = images;
    if (status !== undefined) iranga.status = status;

    await iranga.save();
    return res.json(iranga);
  } catch {
    return res.status(400).json({ error: "Nepavyko atnaujinti" });
  }
}

export async function adminDeleteEquipment(req, res) {
  const { id } = req.params;
  try {
    const rezultatas = await Equipment.deleteOne({ _id: id });
    if (rezultatas.deletedCount === 0) {
      return res.status(404).json({ error: "Įranga nerasta" });
    }
    return res.json({ ok: true });
  } catch {
    return res.status(400).json({ error: "Nepavyko ištrinti" });
  }
}

export async function adminChangeEquipmentStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: "Trūksta būsenos" });

  try {
    const iranga = await Equipment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!iranga) return res.status(404).json({ error: "Įranga nerasta" });
    return res.json(iranga);
  } catch {
    return res.status(400).json({ error: "Nepavyko pakeisti būsenos" });
  }
}
