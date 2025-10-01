const debug = require("debug")("demo:server");

const ServerLogger = require("./ServerLogger");

module.exports = class ServerHelper {
  static setup(server, port) {
    server.set("port", port);
    server.on("error", this.onError);
    server.on("listening", this.onListening);
  }

  static normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
      return val;
    }

    if (port >= 0) {
      return port;
    }

    return false;
  }

  static onError(error) {
    if (error.syscall !== "listen") {
      throw error;
    }

    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    switch (error.code) {
      case "EACCES":
        ServerLogger.error(bind + " requires elevated privileges");
        process.exit(1);
        break;
      case "EADDRINUSE":
        ServerLogger.error(bind + " is already in use");
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  static onListening() {
    const addr = server.address();
    const bind =
      typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    debug("Listening on " + bind);
  }
};
