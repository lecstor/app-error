app-error
=========

Simplify error handling in microservices

Install
-------
```sh
$ yarn add @lecstor/app-error
```

Usage
-----
```js
const AppError = require('@lecstor/app-error');

const error = AppError(
  "EmailInvalid",
  {
    status: 400,
    message: "Not a valid email address"
  }
);

console.log(error.stack);
EmailInvalid: Not a valid email address
    at repl:1:15
    ...

const response = error.getResponse();

console.log(response);
{
  name: 'EmailInvalid',
  message: 'Not a valid email address',
  status: 400,
  isAppError: true,
  isExpected: true
}
```

#### In Express
```js
const express = require("express");
const requestP = require("request-promise-native");
const bunyan = require("bunyan");
const {
  RemoteError, bunyanSerializer
} = require("@lecstor/app-error");

const buffer = new bunyan.RingBuffer({ limit: 10 });

const log = bunyan.createLogger({
  serializers: { err: bunyanSerializer }
});

const app = express();

/**
 * our function that creates a user with a call to the user service
 * and throws RemoteErrors
 */
function createUser() {
  return requestP.post({ uri: "http://localhost:4321/new-user" })
    .catch(err => {
      throw RemoteError(err.error);
    });
}

/**
 * our routes all end with a catch which calls `next`
 */
app.post("/create-user", (req, res, next) =>
  createUser().catch(next)
);

/**
 * our app includes an error handler which gets those `next` calls
 */
app.use(function(err, req, res, next) {
  if (err.isAppError) {
    const response = err.getResponse();
    res.status(response.status).send(response);
    if (err.isExpected) {
      log.info({ err });
    } else {
      log.error({ err });
    }
  } else {
    res.send(err);
    log.error({ err });
  }
});

module.exports = app;
```
