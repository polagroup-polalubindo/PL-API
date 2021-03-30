const { User } = require("../models");
const { verifyToken } = require("../helpers/jwt");

const authentication = async (req, res, next) => {
  const { access_token } = req.headers;
  try {
    const userLogin = verifyToken(access_token);
    const data = await User.findOne({ where: { email: userLogin.email } });
    if (data) {
      req.user = userLogin;
      next();
    } else {
      throw { messagee: `doesnt recognize user` };
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = authentication;
