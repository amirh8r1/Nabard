const zod = require("zod");

const login = zod
  .object(
    {
      auth: zod
        .object(
          {
            username: zod
              .string({
                required_error: "نام کاربری ارسال نشده",
                invalid_type_error: "نام کاربری به درستی ارسال نشده",
              })
              .min(1, {
                message: "نام کاربری خالی ارسال شده",
              }),
            password: zod
              .string({
                required_error: "رمز عبور ارسال نشده",
                invalid_type_error: "رمز عبور به درستی ارسال نشده",
              })
              .min(1, {
                message: "رمز عبور خالی ارسال شده",
              }),
          },
          {
            required_error: "مشخصات ورود ارسال نشده",
            invalid_type_error: "مشخصات ورود به درستی ارسال نشده",
          }
        )
        .required({
          username: true,
          password: true,
        }),
    },
    {
      required_error: "مشخصات ورود ارسال نشده",
      invalid_type_error: "مشخصات ورود به درستی ارسال نشده",
    }
  )
  .required({
    auth: true,
  });

module.exports = { login };
