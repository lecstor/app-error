const express = require("express");
const requestP = require("request-promise-native");
const { RemoteError } = require("../");

const app = express();

/**
 * our function that creates a user with a call to the user service
 * and throws RemoteErrors
 */
function createUser() {
  return requestP.post({ uri: "http://localhost:4321/new-user" }).catch(err => {
    throw RemoteError(err.error);
  });
}

/**
 * our routes all end with a catch which calls `next`
 */
app.post("/create-user", (req, res, next) => createUser().catch(next));

/**
 * our app includes an error handler which gets those `next` calls
 */
app.use(function(err, req, res, next) {
  if (err.isAppError) {
    const response = err.getResponse();
    res.status(response.status).send(response);
  } else {
    res.send(err);
  }
});

module.exports = app;
