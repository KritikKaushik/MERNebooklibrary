const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      req.user = await User.findById(decoded.id).select(
        "-password"
      );

      // A token must not authorize access after its account is deleted.
      if (!req.user) {
        return res.status(401).json({
          message: "User no longer exists",
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      message: "No token provided",
    });
  }
};

module.exports = { protect };
