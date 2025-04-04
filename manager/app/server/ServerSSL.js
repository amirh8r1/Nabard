const fs = require("fs");
const path = require("path");

module.exports = class ServerSSL {
  static getSSLData() {
    return {
      key: fs.readFileSync(
        path.resolve(__dirname, process.env.SSL_KEY_PATH),
        "utf-8"
      ),
      cert: fs.readFileSync(
        path.resolve(__dirname, process.env.SSL_CERT_PATH),
        "utf-8"
      ),
      ca: fs.readFileSync(
        path.resolve(__dirname, process.env.SSL_CHAIN_PATH),
        "utf-8"
      ),
    };
  }
};
