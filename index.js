"use strict";

// Object.defineProperty(exports, "__esModule", {
//   value: true
// });

/* So you can 'var VError = require('verror')' */
module.exports = AppError;
/* For compatibility */
AppError.AppError = AppError;
/* Other exported classes */
AppError.RemoteError = RemoteError;

const isString = require("lodash/isString");
const isError = require("lodash/isError");
const isObject = require("lodash/isObject");
const isFunction = require("lodash/isFunction");
const get = require("lodash/get");

/**
 * create an app error
 *
 * AppError("MyError", "my message");
 * AppError([Function: MyError], "my message");
 * AppError("MyError", {
 *   message: "my message",
 *   status: 400,
 *   cause: new Error("Bad")
 * });
 * AppError({
 *   name: "MyError",
 *   message: "my message",
 *   status: 400,
 *   cause: new Error("Bad")
 * });
 * @export
 * @param {String|Function} [traceFn="AppError"] used as the name of the error
 *    and to limit the stacktrace (defaults to AppError if not a function)
 * @param {Object|String|Error} [opts={}]
 * @param {String} $1.message the error message
 * @param {Number} $1.status the HTTP status code to be used in a response
 * @param {Error} $1.cause the error which caused the issue
 * @param {Object} $1.meta extra properties
 * @returns {Error} and AppError object
 */
// export default function AppError(traceFn = "AppError", ...options) {
function AppError(...args) {
  let name;
  let traceFn;
  /*
   * the first arg can be an object, string, or function
   * - use a string as the error name
   * - use a function name as the error name and captureStackTrace fn
   * - take the error name from the object name property or default to AppError
   */
  if (args.length === 0) {
    name = "AppError";
  } else if (isFunction(args[0])) {
    let traceFn = args.shift();
    name = traceFn.name;
  } else if (isObject(args[0])) {
    name = args[0].name || "AppError";
  } else {
    name = args.shift();
    traceFn = AppError;
  }

  // set default for the error's properties
  let props = {
    name,
    message: "",
    status: 500,
    // meta: {}
    // cause: null
    isAppError: true,
    responseKeys: ["name", "message", "status", "meta", "isAppError"]
  };

  // proces each of the call's args
  args.forEach(opt => {
    if (isString(opt)) {
      props.message = opt;
    } else if (isError(opt)) {
      props.message = opt.message;
      props.cause = opt;
    } else {
      Object.assign(props, opt);
    }
  });

  const error = Error();

  // return all props listed in responseKeys as an object
  error.getResponse = function() {
    return this.responseKeys.reduce((resp, key) => {
      if (this[key]) {
        resp[key] = get(this, key);
      }
      return resp;
    }, {});
  };

  Object.assign(error, props);
  Error.captureStackTrace(error, traceFn);
  return error;
}

function RemoteError(opts) {
  const error = AppError(opts);
  error.isRemoteError = true;
  return error;
}
