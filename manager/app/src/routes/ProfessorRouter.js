const router = require("express").Router();

const ProfessorController = require("../controllers/ProfessorController");

const AuthMiddleware = require("../middlewares/AuthMiddleware");
const ResponseMiddleware = require("../middlewares/ResponseMiddleware");

module.exports = class ProfessorRouter {
  static get domain() {
    return "/api/v1/professor";
  }

  static setupRouter() {
    router.get(
      "/",
      AuthMiddleware.auth,
      ProfessorController.getAll,
      ResponseMiddleware.send
    );

    router.post(
      "/",
      AuthMiddleware.auth,
      ProfessorController.create,
      ResponseMiddleware.send
    );

    router.put(
      "/:professorId",
      AuthMiddleware.auth,
      ProfessorController.update,
      ResponseMiddleware.send
    );

    router.delete(
      "/:professorId",
      AuthMiddleware.auth,
      ProfessorController.delete,
      ResponseMiddleware.send
    );

    return router;
  }
};
