const fs = require("fs");
const path = require("path");

const ServerLogger = require("./ServerLogger");

const ROUTES_PATH = path.resolve(__dirname, "../src/routes");

module.exports = class ServerRouter {
  static setup(app) {
    try {
      fs.readdir(ROUTES_PATH, (error, files) => {
        if (error) {
          this.raiseError(error);

          return false;
        }

        files.forEach((file) => {
          let filePath = path.resolve(ROUTES_PATH, file);
          let Router = require(filePath);

          if (Router.domain != null) {
            ServerLogger.debug(`Route ${file} loaded`);

            app.use(Router.domain, Router.setupRouter());
          }
        });

        this.catchUnhandled(app);
      });
    } catch (error) {
      throw error;
    }
  }

  static catchUnhandled(app) {
    app.use((req, res, next) => {
      ServerLogger.warn("Route not found: " + req.originalUrl);
      res.status(404).json({
        message: "Route not found",
      });
    });
  }

  static raiseError(error) {
    ServerLogger.error("Route loader: " + error);

    process.exit(1);
  }
};
