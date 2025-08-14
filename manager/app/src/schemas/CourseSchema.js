const zod = require("zod");

const getByCourseIdSchema = zod.object({
  courseId: zod.coerce.number().int().positive(),
});

const createCourseSchema = zod.object({
  name: zod.string().min(2, "نام درس باید حداقل ۲ کاراکتر باشد"),
  credit: zod.number().int().positive("تعداد واحد باید مثبت باشد"),
  semester: zod.number().int().positive("شماره ترم باید مثبت باشد"),
});

const updateCourseSchema = createCourseSchema.partial();

module.exports = {
  getByCourseIdSchema,
  createCourseSchema,
  updateCourseSchema,
};
