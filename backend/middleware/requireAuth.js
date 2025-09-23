import jwt from "jsonwebtoken";

export default function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Neautorizuota" });
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, process.env.SECRET);
    req.user = { _id: payload._id };
    next();
  } catch {
    return res.status(401).json({ error: "Neautorizuota" });
  }
}
