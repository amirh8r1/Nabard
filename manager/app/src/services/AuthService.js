const jwt = require("jsonwebtoken");

module.exports = class AuthService {
  static JWTToken(userId) {
    try {
      const accessToken = jwt.sign(
        { type: "accessToken", userId },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_ACCESS_EXPIRE,
        }
      );

      const refreshToken = jwt.sign(
        { type: "refreshToken", userId },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_REFRESH_EXPIRE,
        }
      );

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }
};
