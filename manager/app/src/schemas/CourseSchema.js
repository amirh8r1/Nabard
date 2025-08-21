const zod = require("zod");

const getByCourseIdSchema = zod.object({
  courseId: zod.coerce.number().int().positive(),
});

const createCourseSchema = zod.object({
  name: zod.string().min(2, "نام درس باید حداقل ۲ کاراکتر باشد"),
  credit: zod.number().int().positive("تعداد واحد باید مثبت باشد"),
  semester: zod
    .number()
    .int()
    .min(1, "شماره ترم باید حداقل ۱ باشد")
    .max(8, "شماره ترم حداکثر ۸ می‌تواند باشد"),
});

const updateCourseSchema = createCourseSchema.partial();

module.exports = {
  getByCourseIdSchema,
  createCourseSchema,
  updateCourseSchema,
};
