module.exports = bunyanSerializer;
/* For compatibility */
bunyanSerializer.bunyanSerializer = bunyanSerializer;

/**
 * Borrowed from Bunyan
 */
function getFullErrorStack(ex) {
  var ret = ex.stack || ex.toString();
  if (ex.cause && typeof ex.cause === "function") {
    var cex = ex.cause();
    if (cex) {
      ret += "\nCaused by: " + getFullErrorStack(cex);
    }
  }
  return ret;
}

/**
 * Borrowed from Bunyan and tweaked
 */
function bunyanSerializer(err) {
  if (!err || !err.stack) {
    return err;
  }
  const logRecord = {
    message: err.message,
    name: err.name,
    code: err.code,
    signal: err.signal,

    // add some AppError props
    status: err.status,
    meta: err.meta,
    isRemoteError: err.isRemoteError
  };
  if (!err.isExpected) {
    logRecord.stack = getFullErrorStack(err);
  }
  return logRecord;
}
