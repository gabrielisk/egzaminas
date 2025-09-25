import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.statics.signup = async function (email, password) {
  if (!email || !password) throw Error("Užpildykite visus laukus");
  if (!validator.isEmail(email)) throw Error("Netinkamas el. paštas");
  if (!validator.isStrongPassword(password))
    throw Error("Slaptažodis per silpnas");

  const exists = await this.findOne({ email });
  if (exists) throw Error("Toks el.paštas jau naudojamas");

  const hash = await bcrypt.hash(password, 10);
  return this.create({ email, password: hash });
};

userSchema.statics.login = async function (email, password) {
  if (!email || !password) throw Error("Užpildykite visus laukus");
  const user = await this.findOne({ email });
  if (!user) throw Error("Neteisingas el. paštas arba slaptažodis");
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw Error("Neteisingas el. paštas arba slaptažodis");
  return user;
};

export default mongoose.model("User", userSchema);
