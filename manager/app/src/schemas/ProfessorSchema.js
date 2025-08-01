const zod = require("zod");

const daysOfWeek = ["saturday", "sunday", "monday", "tuesday", "wednesday"];

const timeSchema = zod.object({
  start: zod
    .number({
      required_error: "زمان شروع ارسال نشده",
      invalid_type_error: "زمان شروع باید عدد باشد",
    })
    .min(0, { message: "زمان شروع نمی‌تواند کمتر از ۰ باشد" })
    .max(24, { message: "زمان شروع نمی‌تواند بیشتر از ۲۴ باشد" }),
  end: zod
    .number({
      required_error: "زمان پایان ارسال نشده",
      invalid_type_error: "زمان پایان باید عدد باشد",
    })
    .min(0, { message: "زمان پایان نمی‌تواند کمتر از ۰ باشد" })
    .max(24, { message: "زمان پایان نمی‌تواند بیشتر از ۲۴ باشد" }),
});

const workingHoursSchema = zod.object(
  daysOfWeek.reduce((acc, day) => {
    acc[day] = zod.array(timeSchema).optional();
    return acc;
  }, {})
);

const create = zod.object({
  name: zod
    .string({
      required_error: "نام استاد ارسال نشده",
      invalid_type_error: "نام استاد به درستی ارسال نشده",
    })
    .min(1, { message: "نام استاد خالی ارسال شده" }),
  workingHours: workingHoursSchema,
});

const professorId = zod.object({
  professorId: zod
    .string()
    .regex(/^\d+$/, { message: "شناسه استاد باید یک عدد باشد" })
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "شناسه استاد باید یک عدد مثبت باشد",
    }),
});

const update = zod.object({
  name: zod
    .string({
      invalid_type_error: "نام استاد به درستی ارسال نشده",
    })
    .optional(),
  workingHours: workingHoursSchema.optional(),
});

module.exports = { create, professorId, update };
