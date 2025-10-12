const jwt = require("jsonwebtoken");
const { Auth } = require("../models/index.js");

const auth = async (req, res, next) => {
  let token;
  if (!req.headers.authorization) {
    return res.status(404).json({
      success: false,
      Message: "Authorization denied.",
    });
  } else {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("decoded ", decoded);

      req.user = await Auth.findByPk(decoded.id);
      next();
    } catch (err) {
      next(err);
    }
  }
};

module.exports = auth;
