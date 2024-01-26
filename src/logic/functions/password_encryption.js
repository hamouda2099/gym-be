const bcrypt = require("bcrypt");

async function hash(password) {
  const hashedPassword = await bcrypt.hashSync(password, 10);
  return hashedPassword;
}

async function decrypt(password, hashedPassword) {
  const match = await bcrypt.compare(password, hashedPassword);
  return match;
}

module.exports = { hash, decrypt };
