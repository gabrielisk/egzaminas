import User from "../models/userModel.js";

export default async function requireAdmin(req, res, next) {
  try {
    if (!req.user?._id) return res.status(401).json({ error: "Neautorizuota" });
    const user = await User.findById(req.user._id).select("isAdmin");
    if (!user?.isAdmin)
      return res.status(403).json({ error: "Reikia administratoriaus teisių" });
    next();
  } catch {
    res.status(500).json({ error: "Nepavyko patikrinti teisių" });
  }
}
