const crypto = require("crypto");

exports.deriveKeyFromSignature = (signature) => {
  return crypto.createHash("sha256").update(signature).digest();
};
