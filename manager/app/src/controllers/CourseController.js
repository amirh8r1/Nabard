const Prisma = require("../databases/Prisma");

const CourseSchema = require("../schemas/CourseSchema");

module.exports = class CourseController {
  static async getAll(user, req, res, next) {
    try {
      const courses = await Prisma.course.findMany({
        where: { status: true, deleted: false },
      });

      next({
        status: 200,
        courses,
      });
    } catch (error) {
      next({
        status: 500,
        message: "خطایی در سرور رخ داده است!",
        error: error,
      });
    }
  }

  static async create(user, req, res, next) {
    try {
      const validation = await CourseSchema.createCourseSchema.safeParseAsync(
        req.body
      );

      if (!validation.success) {
        return next({
          status: 400,
          issues: validation.error.issues,
        });
      }
      const durationPerWeek = validation.data.credit * 60;

      const newCourse = await Prisma.course.create({
        data: {
          name: validation.data.name,
          credit: validation.data.credit,
          durationPerWeek,
          semester: validation.data.semester,
        },
      });

      next({
        status: 201,
        course: newCourse,
      });
    } catch (error) {
      next({
        status: 500,
        message: "خطایی در سرور رخ داده است!",
        error: error,
      });
    }
  }

  static async update(user, req, res, next) {
    try {
      const params = await CourseSchema.getByCourseIdSchema.safeParseAsync(
        req.params
      );
      const validation = await CourseSchema.updateCourseSchema.safeParseAsync(
        req.body
      );

      if (!validation.success || !params.success) {
        return next({
          status: 400,
          issues: [].concat(params.error?.issues, validation.error?.issues),
        });
      }
      const { courseId } = params.data;
      const { name, credit, semester } = validation.data;
      if (!name && !credit && !semester) {
        return next({
          status: 400,
          message: "هیچ فیلدی برای بروزرسانی ارسال نشده است",
        });
      }
      const durationPerWeek = credit * 60;

      const updatedCourse = await Prisma.course.update({
        where: { id: courseId },
        data: {
          name,
          credit,
          durationPerWeek,
          semester,
        },
      });

      next({
        status: 200,
        course: updatedCourse,
      });
    } catch (error) {
      next({
        status: 500,
        message: "خطایی در سرور رخ داده است!",
        error: error,
      });
    }
  }

  static async delete(user, req, res, next) {
    try {
      const params = await CourseSchema.getByCourseIdSchema.safeParseAsync(
        req.params
      );
      if (!params.success) {
        return next({
          status: 400,
          issues: params.error?.issues,
        });
      }
      const { courseId } = params.data;

      const courseExists = await Prisma.course.findUnique({
        where: { id: courseId, deleted: false },
      });
      if (!courseExists) {
        return next({
          status: 404,
          message: "درس مورد نظر یافت نشد",
        });
      }

      await Prisma.course.delete({
        where: { id: courseId },
      });

      next({
        status: 204,
      });
    } catch (error) {
      next({
        status: 500,
        message: "خطایی در سرور رخ داده است!",
        error: error,
      });
    }
  }
};
