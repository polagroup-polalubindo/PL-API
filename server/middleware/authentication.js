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
      throw { message: `doesnt recognize user` };
    }
  } catch (error) {
    return res.status(401).json(error);
  }
};

module.exports = authentication;
