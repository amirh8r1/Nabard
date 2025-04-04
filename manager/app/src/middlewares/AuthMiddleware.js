const jwt = require("jsonwebtoken");
const validator = require("validator");

const Prisma = require("../databases/Prisma");

const ServerLogger = require("../../server/ServerLogger");

module.exports = class AuthMiddleware {
  static async auth(req, res, next) {
    try {
      const accessToken = req.header?.("Authorization")?.replace("Bearer ", "");

      if (!accessToken) {
        return res.status(401).json({
          message: "توکن یافت نشد!",
        });
      }

      if (!validator.isJWT(accessToken)) {
        return res.status(401).json({
          message: "توکن ارسال شده نامعتبر است!",
        });
      }

      const JWTVerify = await jwt.verify(
        accessToken,
        process.env.JWT_SECRET,
        async (err, decoded) => {
          if (err) {
            if (err.name === "TokenExpiredError") {
              return {
                status: false,
                message: "توکن منقضی شده است. لطفا دوباره وارد شوید!",
              };
            } else if (err.name === "JsonWebTokenError") {
              return {
                status: false,
                message: "توکن نامعتبر است!",
              };
            }
          }

          if (decoded.type !== "accessToken") {
            return {
              status: false,
              message: "توکن اینجوری نامعتبر است!",
            };
          }

          const sessionDB = await Prisma.session.findFirst({
            where: {
              accessToken: accessToken,
              status: true,
            },
          });

          if (!sessionDB) {
            return {
              status: false,
              message: "توکن معتبر نیست یا نشست فعال یافت نشد!",
            };
          }

          if (sessionDB.userId !== decoded.userId) {
            return {
              status: false,
              message: "توکن برای کاربر دیگری است!",
            };
          }

          return {
            status: true,
            decoded,
          };
        }
      );

      if (JWTVerify.status === false) {
        return res
          .status(401)
          .json({
            message: JWTVerify.message,
          })
          .end();
      }

      const sessionDB = await Prisma.session.findFirst({
        where: { accessToken: accessToken },
        include: {
          user: {
            include: {
              role: {
                include: {
                  permissions: {
                    include: {
                      action: {
                        select: {
                          code: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!sessionDB) {
        return res
          .status(401)
          .json({
            message: "توکن ثبت نشده است!",
          })
          .end();
      }

      if (!sessionDB.status) {
        return res
          .status(401)
          .json({
            message: "نشست قبلی شما از سامانه خارج است!",
          })
          .end();
      }

      if (sessionDB.userId !== JWTVerify.decoded.userId) {
        return res
          .status(401)
          .json({
            message: "این توکن برای کاربر دیگری است!",
          })
          .end();
      }

      await Prisma.session.update({
        where: {
          id: sessionDB.id,
        },
        data: {
          userAgent: req.header("User-Agent"),
          userIP: (
            req.headers["X-Real-IP"] ||
            req.headers["x-forwarded-for"] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress
          )
            .split(",")[0]
            .replace("::ffff:", ""),
        },
      });

      next(sessionDB.user);
    } catch (error) {
      ServerLogger.error(error);

      res.status(500).json({
        error: process.env.DISPLAY_ERROR_OUTPUT === "true" ? error : null,
        message: "خطایی در سرور رخ داده است!",
      });
    }
  }
};
