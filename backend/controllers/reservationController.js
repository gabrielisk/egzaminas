import Reservation from "../models/reservationModel.js";

export async function createReservation(req, res) {
  const { equipmentId, start, end } = req.body;

  if (!equipmentId || !start || !end) {
    return res.status(400).json({ error: "Trūksta laukų" });
  }

  const pradziosData = new Date(start);
  const pabaigosData = new Date(end);
  if (isNaN(pradziosData) || isNaN(pabaigosData)) {
    return res.status(400).json({ error: "Blogas datos formatas" });
  }

  if (pradziosData >= pabaigosData) {
    return res.status(400).json({ error: "Pradžia turi būti prieš pabaigą" });
  }
  if (pradziosData < new Date()) {
    return res.status(400).json({ error: "Negalima rezervuoti į praeitį" });
  }

  const esamosRezervacijos = await Reservation.find({
    equipment: equipmentId,
    status: { $in: ["laukiama", "patvirtinta", "vykdoma"] },
  });

  let uzimta = false;
  for (const rezervacija of esamosRezervacijos) {
    const rezPradzia = new Date(rezervacija.start);
    const rezPabaiga = new Date(rezervacija.end);

    const persidengia = rezPradzia < pabaigosData && rezPabaiga > pradziosData;
    if (persidengia) {
      uzimta = true;
      break;
    }
  }

  if (uzimta) {
    return res.status(400).json({ error: "Pasirinktas laikas užimtas" });
  }

  const sukurta = await Reservation.create({
    user: req.user._id,
    equipment: equipmentId,
    start: pradziosData,
    end: pabaigosData,
  });

  return res.status(201).json(sukurta);
}

export async function myReservations(req, res) {
  try {
    const manoRezervacijos = await Reservation.find({
      user: req.user._id,
    }).sort({ start: 1 });
    return res.json(manoRezervacijos);
  } catch {
    return res.status(500).json({ error: "Nepavyko gauti rezervacijų" });
  }
}

export async function cancelMyReservation(req, res) {
  const { id } = req.params;

  try {
    const rezervacija = await Reservation.findOne({
      _id: id,
      user: req.user._id,
    });
    if (!rezervacija) {
      return res.status(404).json({ error: "Rezervacija nerasta" });
    }

    if (rezervacija.start <= new Date()) {
      return res
        .status(400)
        .json({ error: "Negalima atšaukti jau prasidėjusios rezervacijos" });
    }

    await Reservation.deleteOne({ _id: rezervacija._id });
    return res.json({ ok: true });
  } catch {
    return res.status(400).json({ error: "Neteisingas ID" });
  }
}

export async function updateMyReservation(req, res) {
  const { id } = req.params;
  const { start, end } = req.body;

  try {
    const manoRezervacija = await Reservation.findOne({
      _id: id,
      user: req.user._id,
    });
    if (!manoRezervacija) {
      return res.status(404).json({ error: "Rezervacija nerasta" });
    }

    const naujaPradzia = new Date(start);
    const naujaPabaiga = new Date(end);

    if (isNaN(naujaPradzia) || isNaN(naujaPabaiga)) {
      return res.status(400).json({ error: "Blogas datos formatas" });
    }
    if (naujaPradzia >= naujaPabaiga) {
      return res.status(400).json({ error: "Pradžia turi būti prieš pabaigą" });
    }
    if (naujaPradzia < new Date()) {
      return res.status(400).json({ error: "Negalima rezervuoti į praeitį" });
    }

    const kitosRezervacijos = await Reservation.find({
      equipment: manoRezervacija.equipment,
      _id: { $ne: manoRezervacija._id },
      status: { $in: ["laukiama", "patvirtinta", "vykdoma"] },
    });

    for (const kitaRezervacija of kitosRezervacijos) {
      const kitosRezervacijosPradzia = new Date(kitaRezervacija.start);
      const kitosRezervacijosPabaiga = new Date(kitaRezervacija.end);

      const persidengia =
        kitosRezervacijosPradzia < naujaPabaiga &&
        kitosRezervacijosPabaiga > naujaPradzia;

      if (persidengia) {
        return res.status(400).json({ error: "Pasirinktas laikas užimtas" });
      }
    }

    manoRezervacija.start = naujaPradzia;
    manoRezervacija.end = naujaPabaiga;
    await manoRezervacija.save();

    return res.json(manoRezervacija);
  } catch {
    return res.status(400).json({ error: "Nepavyko atnaujinti" });
  }
}
