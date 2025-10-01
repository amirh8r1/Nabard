const Prisma = require("../databases/Prisma");

const PlanningSchema = require("../schemas/PlanningSchema");

const { generatePlan } = require("../utils/GeneratePlan");

module.exports = class PlanningController {
  static async generate(user, req, res, next) {
    try {
      const validation = await PlanningSchema.generate.safeParseAsync(req.body);
      if (!validation.success) {
        return next({
          status: 400,
          issues: validation.error.issues,
        });
      }

      const { assignments } = validation.data;

      const courseIds = assignments.map((a) => a.courseId);
      const professorIds = [
        ...new Set(assignments.flatMap((a) => a.professors)),
      ];

      const courses = await Prisma.course.findMany({
        where: { id: { in: courseIds } },
        select: {
          id: true,
          name: true,
          credit: true,
          semester: true,
        },
      });
      const professors = await Prisma.professor.findMany({
        where: { id: { in: professorIds } },
        select: {
          id: true,
          name: true,
          workingHours: true,
        },
      });

      if (courses.length !== courseIds.length) {
        return next({
          status: 404,
          message: "درس‌های انتخاب شده یافت نشدند!",
        });
      }
      if (professors.length !== professorIds.length) {
        return next({
          status: 404,
          message: "اساتید انتخاب شده یافت نشدند!",
        });
      }

      try {
        const generatedPlan = generatePlan({
          assignments,
          courses,
          professors,
        });
        return next({
          status: 200,
          plan: generatedPlan,
        });
      } catch (err) {
        if (err.message.includes("امکان تولید برنامه پیشنهادی")) {
          return next({
            status: 409, // Conflict
            message: err.message,
          });
        }
        return next({
          status: 500,
          message: "خطایی در تولید برنامه پیشنهادی رخ داده است!",
          error: err,
        });
      }
    } catch (error) {
      return next({
        status: 500,
        message: "خطایی در سرور رخ داده است!",
        error: error || error.Error,
      });
    }
  }
};
