const { User } = require("../models");

const authorization = async (req, res, next) => {
  try {
    let data = await User.findByPk(req.user.id);
    if (data.role === "admin") {
      next();
    } else {
      if (req.params.customerId && +req.params.customerId === req.user.id) {
        next()
      } else {
        throw { message: `you're not an admin` };
      }
    }
  } catch (error) {
    return res.status(401).json(error);
  }
};

module.exports = authorization;
