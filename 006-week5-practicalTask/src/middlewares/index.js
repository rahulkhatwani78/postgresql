const fs = require("fs");

function logRequest(fileName) {
  return (req, res, next) => {
    fs.appendFile(
      fileName,
      `${Date.now()}: ${req.ip} - ${req.method} - ${req.path}\n`,
      (err, data) => {
        if (err) {
          console.log(err);
        }
        next();
      },
    );
  };
}

function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({
    status: 500,
    message: "Internal Server Error",
    error: err,
  });
}

module.exports = {
  logRequest,
  errorHandler,
};
