const fs = require("fs");
const path = require("path");

const LOG_PATH = path.resolve(process.env.LOG_STORAGE_PATH);

module.exports = class serverFileSystem {
  static async setup() {
    try {
      if (!fs.existsSync(LOG_PATH)) fs.mkdirSync(LOG_PATH);
    } catch (error) {
      throw error;
    }
  }
};
