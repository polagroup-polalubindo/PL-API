const bcrypt = require("bcryptjs");

const createHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

const compareHash = (password, passwordHash) => {
  return bcrypt.compareSync(password, passwordHash);
};

module.exports = { createHash, compareHash };
