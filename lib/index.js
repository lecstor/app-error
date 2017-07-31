"use strict";

const AppError = require("./app-error");
const RemoteError = require("./remote-error");
const bunyanSerializer = require("./bunyan-serializer");

module.exports = AppError;
/* For compatibility */
AppError.AppError = AppError;
/* Other exported classes */
AppError.RemoteError = RemoteError;
AppError.bunyanSerializer = bunyanSerializer;
