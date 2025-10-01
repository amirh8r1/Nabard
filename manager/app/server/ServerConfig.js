module.exports = function () {
  process.env.SECURE_CONNECTIONS === "true"
    ? (process.env.CONNECTION_PROTOCOL = "https")
    : (process.env.CONNECTION_PROTOCOL = "http");

  if (process.env.NODE_ENV === "production") {
    if (process.env.SECURE_CONNECTIONS === "true") {
      process.env.PORTS = process.env.HTTPS_PRODUCTION_PORT;
      process.env.PORT = process.env.HTTP_PRODUCTION_PORT;
    } else {
      process.env.PORT = process.env.HTTP_PRODUCTION_PORT;
    }
  } else {
    if (process.env.SECURE_CONNECTIONS === "true") {
      process.env.PORTS = process.env.HTTPS_DEVELOPMENT_PORT;
      process.env.PORT = process.env.HTTP_DEVELOPMENT_PORT;
    } else {
      process.env.PORT = process.env.HTTP_DEVELOPMENT_PORT;
    }
  }

  process.env.URL =
    process.env.CONNECTION_PROTOCOL +
    "://" +
    process.env.DOMAIN +
    (process.env.NODE_ENV === "development"
      ? ":" +
        (process.env.SECURE_CONNECTIONS === "true"
          ? process.env.PORTS
          : process.env.PORT)
      : "");
};
