module.exports = class ServerMaintenance {
  static preservation(req, res, next) {
    try {
      if (process.env.MAINTENANCE_MODE === "true") {
        res.status(503).render("Maintenance");
      } else {
        next();
      }
    } catch (error) {
      throw error;
    }
  }
};
