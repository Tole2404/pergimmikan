const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");
const AdminModel = require("../models/admin.model");

const auth = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "development") {
      console.log("Auth middleware: Running in development mode");
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "No token provided");
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      let user = await AdminModel.findById(decoded.id);
      if (!user) {
        const User = require("../models/user.model");
        user = await User.findById(decoded.id);
        if (!user) {
          throw new ApiError(401, "Invalid token - User not found");
        }
      }

      if (user.status === "inactive") {
        throw new ApiError(401, "User account is inactive");
      }

      req.user = {
        id: user.id,
        role: user.role,
        username: user.username,
      };

      if (user.role === "admin") {
        req.user.role = "admin";
      } else {
        req.user.role = "user";
      }
    } catch (error) {
      console.error("Token verification error:", error);
      if (error.name === "JsonWebTokenError") {
        throw new ApiError(401, "Invalid token");
      }
      if (error.name === "TokenExpiredError") {
        throw new ApiError(401, "Token expired");
      }
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = auth;
