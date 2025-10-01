const router = require("express").Router();

const PlanningController = require("../controllers/PlanningController");

const AuthMiddleware = require("../middlewares/AuthMiddleware");
const ResponseMiddleware = require("../middlewares/ResponseMiddleware");

module.exports = class PlanningRouter {
  static get domain() {
    return "/api/v1/planning";
  }

  static setupRouter() {
    router.post(
      "/generate",
      AuthMiddleware.auth,
      PlanningController.generate,
      ResponseMiddleware.send
    );

    return router;
  }
};
