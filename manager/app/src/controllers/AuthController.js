const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const Prisma = require("../databases/Prisma");

const AuthSchema = require("../schemas/AuthSchema");

module.exports = class AuthController {
  static async login(req, res, next) {
    try {
      const validation = await AuthSchema.login.safeParseAsync(req.body);

      if (!validation.success) {
        return next({
          status: 400,
          issues: validation.error.issues,
        });
      }

      const userCheckDB = await Prisma.user.findFirst({
        where: {
          username: validation.data.auth.username,
        },
      });

      if (
        !userCheckDB ||
        !(await bcrypt.compareSync(
          validation.data.auth.password,
          userCheckDB.password
        ))
      ) {
        return next({
          status: 406,
          message: "نام کاربری یا رمز عبور اشتباه است",
        });
      }

      const JWTToken = AuthService.JWTToken(userCheckDB.id);

      await Prisma.session.create({
        data: {
          userId: userCheckDB.id,
          accessToken: JWTToken.accessToken,
          refreshToken: JWTToken.refreshToken,
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

      res
        .status(200)
        .cookie("refreshToken", JWTToken.refreshToken, {
          httpOnly: true,
          sameSite: "strict",
        })
        .header("Authorization", "Bearer " + JWTToken.accessToken)
        .json({
          user: {
            id: userCheckDB.id,
            username: userCheckDB.username,
          },
          session: {
            accessToken: JWTToken.accessToken,
          },
        })
        .end();
    } catch (error) {
      next({
        status: 500,
        message: "خطایی در سرور رخ داده است!",
        error: error,
      });
    }
  }

  static async refresh(req, res, next) {
    try {
      const refreshToken = req.cookies?.refreshToken?.replace("Bearer ", "");

      if (!refreshToken) {
        return next({
          status: 401,
          message: "اطلاعات ارسال شده نامعتبر است!",
        });
      }

      if (!validator.isJWT(refreshToken)) {
        return next({
          status: 401,
          message: "توکن ارسال شده نامعتبر است!",
        });
      }
      const JWTVerify = await jwt.verify(
        refreshToken,
        process.env.JWT_SECRET,
        async (err, decoded) => {
          if (err) {
            await Prisma.session.updateMany({
              where: { refreshToken: refreshToken },
              data: { status: false },
            });

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

          if (decoded.type !== "refreshToken") {
            return {
              status: false,
              message: "توکن اینجوری نامعتبر است!",
            };
          }

          const sessionDB = await Prisma.session.findFirst({
            where: {
              refreshToken: refreshToken,
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

      const JWTToken = AuthService.JWTToken(JWTVerify.decoded.userId);

      await Prisma.session
        .updateMany({
          where: { refreshToken: refreshToken },
          data: {
            refreshToken: JWTToken.refreshToken,
            accessToken: JWTToken.accessToken,
          },
        })
        .then()
        .catch((err) => {
          throw err;
        });

      res
        .status(200)
        .cookie("refreshToken", JWTToken.refreshToken, {
          httpOnly: true,
          sameSite: "strict",
        })
        .header("Authorization", "Bearer " + JWTToken.accessToken)
        .json({
          session: {
            accessToken: JWTToken.accessToken,
          },
        })
        .end();
    } catch (error) {
      next({
        status: 500,
        message: "خطایی در سرور رخ داده است!",
        error: error,
      });
    }
  }

  static async profile(user, req, res, next) {
    try {
      next({
        status: 200,
        user: {
          id: user.id,
          username: user.username,
        },
      });
    } catch (error) {
      next({
        status: 500,
        message: "خطایی در سرور رخ داده است!",
        error: error,
      });
    }
  }

  static async logout(user, req, res, next) {
    try {
      const accessToken = req.headers.authorization?.replace("Bearer ", "");

      if (!accessToken) {
        return next({
          status: 401,
          message: "توکن معتبر نیست!",
        });
      }

      const updateResult = await Prisma.session.updateMany({
        where: {
          accessToken: accessToken,
          userId: user.id,
          status: true,
          deleted: false,
        },
        data: {
          status: false,
        },
      });

      if (updateResult.count === 0) {
        return res.status(401).json({
          message: "نشست یافت نشد یا توکن نامعتبر است!",
        });
      }

      res
        .clearCookie("refreshToken", {
          httpOnly: true,
          sameSite: "strict",
        })
        .status(200)
        .json({
          message: "با موفقیت خارج شدید!",
        })
        .end();
    } catch (error) {
      next({
        status: 500,
        message: "خطایی در سرور رخ داده است!",
        error: error,
      });
    }
  }
};
