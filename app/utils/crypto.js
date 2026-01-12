const crypto = require("crypto");

const ALGO = "aes-256-cbc";
const KEY = crypto
  .createHash("sha256")
  .update(process.env.MEDICAL_SECRET)
  .digest(); // 32 bytes

exports.encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGO, KEY, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
};

exports.decrypt = (encrypted) => {
  const [ivHex, data] = encrypted.split(":");
  const iv = Buffer.from(ivHex, "hex");

  const decipher = crypto.createDecipheriv(ALGO, KEY, iv);
  let decrypted = decipher.update(data, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};
