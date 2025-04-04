const ServerLogger = require("../../server/ServerLogger");

module.exports = class ResponseMiddleware {
  static send(data, req, res, next) {
    try {
      if (data.error) {
        if (process.env.NODE_ENV === "development") {
          console.log(data);
        }
        ServerLogger.error(JSON.stringify(data));

        res
          .status(data.status)
          .json({
            error:
              process.env.DISPLAY_ERROR_OUTPUT === "true"
                ? data.error
                : undefined,
            message: data.message || undefined,
          })
          .end();
      } else {
        res.status(data.status).json(data).end();
      }
    } catch (error) {
      ServerLogger.error(error);

      res.status(500).json({
        error: process.env.DISPLAY_ERROR_OUTPUT === "true" ? error : null,
        message: "خطایی در سرور رخ داده است!",
      });
    }
  }
};
