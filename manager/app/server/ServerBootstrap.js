const express = require("express");

const ServerRouter = require("./ServerRouter");
const ServerExpress = require("./ServerExpress");
const serverFileSystem = require("./ServerFileSystem");

const app = express();

module.exports = class ServerBootstrap {
  static boot() {
    try {
      ServerExpress.setup(app, express);
      ServerRouter.setup(app);

      if (process.env.STORAGE_STATUS === "true") {
        serverFileSystem.setup();
      }

      return app;
    } catch (error) {
      throw error;
    }
  }
};
