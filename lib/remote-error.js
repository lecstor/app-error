"use strict";

const AppError = require("./app-error");

module.exports = RemoteError;
/* For compatibility */
RemoteError.RemoteError = RemoteError;

function RemoteError(opts) {
  const error = AppError(opts);
  error.isRemoteError = true;
  error.isExpected = opts.isExpected || false;
  return error;
}
