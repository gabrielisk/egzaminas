import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const createToken = (_id) =>
  jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });

export const signupUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.signup(email, password);
    const token = createToken(user._id);
    res.status(200).json({ email: user.email, token });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.json({ email: user.email, token });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

export const authCheck = (req, res) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  try {
    jwt.verify(token, process.env.SECRET);
    res.json(true);
  } catch {
    res.json(false);
  }
};
