const router = require("express").Router();

const AuthController = require("../controllers/AuthController");

const AuthMiddleware = require("../middlewares/AuthMiddleware");
const ResponseMiddleware = require("../middlewares/ResponseMiddleware");

module.exports = class AuthRouter {
  static get domain() {
    return "/api/v1/auth";
  }

  static setupRouter() {
    router.get("/login", AuthController.login, ResponseMiddleware.send);

    router.get("/refresh", AuthController.refresh, ResponseMiddleware.send);

    router.get(
      "/",
      AuthMiddleware.auth,
      AuthController.profile,
      ResponseMiddleware.send
    );

    router.get(
      "/logout",
      AuthMiddleware.auth,
      AuthController.logout,
      ResponseMiddleware.send
    );

    return router;
  }
};
