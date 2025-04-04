const path = require("path");

const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const ServerLogger = require("./ServerLogger");
const ServerMaintenance = require("./ServerMaintenance");

module.exports = class ServerExpress {
  static setup(app, express) {
    try {
      const viewsPath = path.join(__dirname, "../views");
      const publicDirectoryPath = path.join(__dirname, "../public");

      app.use(cors());
      app.options("*", cors());

      app.use(helmet());

      app.use(
        morgan(
          ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :response-time ms :res[content-length] ":referrer" ":user-agent"',
          {
            stream: {
              write: (log) => {
                ServerLogger.http(log);
              },
            },
          }
        )
      );

      app.use(ServerMaintenance.preservation);

      app.set("view engine", "hbs");
      app.set("views", viewsPath);

      app.use(
        express.json({
          limit: process.env.MAX_JSON_SIZE,
        })
      );
      app.use(express.static(publicDirectoryPath));
      app.use(
        express.urlencoded({
          extended: false,
          limit: process.env.MAX_JSON_SIZE,
        })
      );
      app.use(cookieParser());

      app.use(function (err, req, res, next) {
        res.locals.message = err.message;
        res.locals.error = req.app.get("env") === "development" ? err : {};

        res.status(err.status || 500);
        res.json({
          message: err.message,
        });
      });
    } catch (error) {
      throw error;
    }
  }
};
