const router = require("express").Router();

const CourseController = require("../controllers/CourseController");

const AuthMiddleware = require("../middlewares/AuthMiddleware");
const ResponseMiddleware = require("../middlewares/ResponseMiddleware");

module.exports = class CourseRouter {
  static get domain() {
    return "/api/v1/course";
  }

  static setupRouter() {
    router.get(
      "/",
      AuthMiddleware.auth,
      CourseController.getAll,
      ResponseMiddleware.send
    );

    router.post(
      "/",
      AuthMiddleware.auth,
      CourseController.create,
      ResponseMiddleware.send
    );

    router.put(
      "/:courseId",
      AuthMiddleware.auth,
      CourseController.update,
      ResponseMiddleware.send
    );

    router.delete(
      "/:courseId",
      AuthMiddleware.auth,
      CourseController.delete,
      ResponseMiddleware.send
    );

    return router;
  }
};
