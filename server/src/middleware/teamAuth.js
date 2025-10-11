const jwt = require('jsonwebtoken');
const ApiError = require('../utils/apiError');
const UserModel = require('../models/team/user.model');

module.exports = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'No token provided');
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists and is active
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      throw new ApiError(401, 'Invalid token - User not found');
    }

    if (user.status === 'inactive') {
      throw new ApiError(401, 'User account is inactive');
    }

    // Add user info to request
    req.user = {
      id: user.id,
      username: user.username,
      role_id: user.role_id,
      role_name: user.role_name
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new ApiError(401, 'Invalid token'));
    } else if (error.name === 'TokenExpiredError') {
      next(new ApiError(401, 'Token expired'));
    } else {
      next(error);
    }
  }
};
