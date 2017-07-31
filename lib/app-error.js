"use strict";

const isString = require("lodash/isString");
const isError = require("lodash/isError");
const isObject = require("lodash/isObject");
const isFunction = require("lodash/isFunction");
const get = require("lodash/get");

module.exports = AppError;
/* For compatibility */
AppError.AppError = AppError;

function AppError(...args) {
  let name = "";
  let message = "";
  let traceFn;
  /*
   * the first arg can be a string, function, error, or object
   * - use a string as the error name if there's more than one arg, otherwise
   *       it's a message
   * - use a function name as the error name and captureStackTrace fn
   * - take the name from an error
   * - take the error name from an object's name property or default to AppError
   */
  if (args.length === 0) {
    // wat? oh well..
    name = "AppError";
    message = "Server Error";
  } else if (args.length === 1 && isString(args[0])) {
    // assume it's a message
    name = "Error";
    message = args[0];
  } else if (isFunction(args[0])) {
    // called via custom error function
    // take it's name and use for captureStackTrace
    let traceFn = args.shift();
    name = traceFn.name;
  } else if (isError(args[0])) {
    // take it's name
    const err = args.shift();
    name = err.name;
    message = err.message;
  } else if (isObject(args[0])) {
    // it's an options object
    name = args[0].name || "AppError";
  } else {
    // it's an error name string
    name = args.shift();
    traceFn = AppError;
  }

  // set default for the error's properties
  let props = {
    name,
    message,
    status: 500,
    // meta: {}
    // cause: null
    isAppError: true,
    isExpected: !(name === "AppError" || name === "Error"),
    responseKeys: [
      "name",
      "message",
      "status",
      "meta",
      "isAppError",
      "isExpected"
    ]
  };

  // process each of the call's args
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
  props._cause = props.cause;

  const error = Error();
  Object.assign(error, props);

  // return all props listed in responseKeys as an object
  error.getResponse = getErrorResponse;
  error.cause = getCause;

  Error.captureStackTrace(error, traceFn);
  return error;
}

function getCause() {
  return this._cause;
}

function getErrorResponse() {
  return this.responseKeys.reduce((resp, key) => {
    if (this[key]) {
      resp[key] = get(this, key);
    }
    return resp;
  }, {});
}
