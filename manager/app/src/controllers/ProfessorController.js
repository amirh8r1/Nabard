const Prisma = require("../databases/Prisma");

const ProfessorSchema = require("../schemas/ProfessorSchema");

module.exports = class ProfessorController {
  static async getAll(user, req, res, next) {
    try {
      const professors = await Prisma.professor.findMany({
        where: { deleted: false, status: true },
      });

      next({
        status: 200,
        professors,
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
      const validation = await ProfessorSchema.create.safeParseAsync(req.body);

      if (!validation.success) {
        return next({
          status: 400,
          issues: validation.error.issues,
        });
      }

      const newProfessor = await Prisma.professor.create({
        data: {
          name: validation.data.name,
          workingHours: validation.data.workingHours,
        },
      });

      next({
        status: 201,
        professor: newProfessor,
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
      const { professorId } = req.params;

      const validation = await ProfessorSchema.professorId.safeParseAsync({
        professorId,
      });
      const bodyValidation = await ProfessorSchema.update.safeParseAsync(
        req.body
      );

      if (!validation.success || !bodyValidation.success) {
        return next({
          status: 400,
          issues: validation.error?.issues || bodyValidation.error?.issues,
        });
      }

      const { name, workingHours } = bodyValidation.data;
      if (!name && !workingHours) {
        return next({
          status: 400,
          message: "هیچ فیلدی برای بروزرسانی ارسال نشده است",
        });
      }

      const updatedProfessor = await Prisma.professor.update({
        where: { id: validation.data.professorId },
        data: {
          ...(name && { name }),
          ...(workingHours && { workingHours }),
        },
      });

      next({
        status: 200,
        professor: updatedProfessor,
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
      const { professorId } = req.params;

      const validation = await ProfessorSchema.professorId.safeParseAsync({
        professorId,
      });

      if (!validation.success) {
        return next({
          status: 400,
          issues: validation.error.issues,
        });
      }

      const professorExists = await Prisma.professor.findUnique({
        where: { id: validation.data.professorId, deleted: false },
      });
      if (!professorExists) {
        return next({
          status: 404,
          message: "استاد مورد نظر یافت نشد",
        });
      }

      await Prisma.professor.delete({
        where: { id: validation.data.professorId },
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
