// import AppError, { RemoteError } from "../app-error";
const AppError = require("../index");
const { RemoteError } = require("../index");

function MyError(...args) {
  return AppError(MyError, ...args);
}

describe("AppError with no args", () => {
  const error = AppError();
  const remoteError = RemoteError(error.getResponse());

  it("is instanceof Error", () => {
    expect(error instanceof Error).toBeTruthy();
    expect(remoteError instanceof Error).toBeTruthy();
  });

  it("has the name AppError", () => {
    expect(error.name).toEqual("AppError");
    expect(remoteError.name).toEqual("AppError");
  });

  it("has isAppError property", () => {
    expect(error.isAppError).toBeTruthy();
    expect(remoteError.isAppError).toBeTruthy();
  });

  it("is not expected", () => {
    expect(error.isExpected).toBeFalsy();
    expect(remoteError.isExpected).toBeFalsy();
  });

  it("has response property", () => {
    const expected = {
      name: "AppError",
      message: "Server Error",
      status: 500,
      isAppError: true
    };
    expect(error.getResponse()).toEqual(expected);
    expect(remoteError.getResponse()).toEqual(expected);
  });
});

describe("AppError with error", () => {
  const error = AppError(new Error("my message"));
  const remoteError = RemoteError(error.getResponse());

  it("is instanceof Error", () => {
    expect(error instanceof Error).toBeTruthy();
    expect(remoteError instanceof Error).toBeTruthy();
  });

  it("has the name Error", () => {
    expect(error.name).toEqual("Error");
    expect(remoteError.name).toEqual("Error");
  });

  it("has isAppError property", () => {
    expect(error.isAppError).toBeTruthy();
    expect(remoteError.isAppError).toBeTruthy();
  });

  it("has isRemoteError property", () => {
    expect(error.isRemoteError).toBeFalsy();
    expect(remoteError.isRemoteError).toBeTruthy();
  });

  it("is not expected", () => {
    expect(error.isExpected).toBeFalsy();
    expect(remoteError.isExpected).toBeFalsy();
  });

  it("has response property", () => {
    const expected = {
      name: "Error",
      message: "my message",
      status: 500,
      isAppError: true
    };
    expect(error.getResponse()).toEqual(expected);
    expect(remoteError.getResponse()).toEqual(expected);
  });

  it("has cause", () => {
    expect(error.cause()).toBeUndefined();
  });
});

describe("AppError with name and options", () => {
  const error = AppError("UserExists", {
    message: "my message",
    status: 400,
    cause: new Error("Bad")
  });
  const remoteError = RemoteError(error.getResponse());

  it("is instanceof Error", () => {
    expect(error instanceof Error).toBeTruthy();
    expect(remoteError instanceof Error).toBeTruthy();
  });

  it("has the name UserExists", () => {
    expect(error.name).toEqual("UserExists");
    expect(remoteError.name).toEqual("UserExists");
  });

  it("has isAppError property", () => {
    expect(error.isAppError).toBeTruthy();
    expect(remoteError.isAppError).toBeTruthy();
  });

  it("is expected", () => {
    expect(error.isExpected).toBeTruthy();
    expect(remoteError.isExpected).toBeTruthy();
  });

  it("has response property", () => {
    const expected = {
      name: "UserExists",
      message: "my message",
      status: 400,
      isAppError: true,
      isExpected: true
    };
    expect(error.getResponse()).toEqual(expected);
    expect(remoteError.getResponse()).toEqual(expected);
  });

  it("has cause", () => {
    expect(error.cause()).toEqual(new Error("Bad"));
    expect(/^\s*Error: Bad\s+at Suite/.test(error.cause().stack)).toBeTruthy();
  });
});

describe("AppError with options", () => {
  const error = AppError({
    name: "UserExists",
    message: "my message",
    status: 400,
    cause: new Error("Bad")
  });
  const remoteError = RemoteError(error.getResponse());

  it("is instanceof Error", () => {
    expect(error instanceof Error).toBeTruthy();
    expect(remoteError instanceof Error).toBeTruthy();
  });

  it("has the name UserExists", () => {
    expect(error.name).toEqual("UserExists");
    expect(remoteError.name).toEqual("UserExists");
  });

  it("has isAppError property", () => {
    expect(error.isAppError).toBeTruthy();
    expect(remoteError.isAppError).toBeTruthy();
  });

  it("is expected", () => {
    expect(error.isExpected).toBeTruthy();
    expect(remoteError.isExpected).toBeTruthy();
  });

  it("has response property", () => {
    const expected = {
      name: "UserExists",
      message: "my message",
      status: 400,
      isAppError: true,
      isExpected: true
    };
    expect(error.getResponse()).toEqual(expected);
    expect(remoteError.getResponse()).toEqual(expected);
  });

  it("has cause", () => {
    expect(error.cause()).toEqual(new Error("Bad"));
    expect(/^\s*Error: Bad\s+at Suite/.test(error.cause().stack)).toBeTruthy();
  });
});

describe("AppError with options inc meta", () => {
  const error = AppError({
    name: "UserExists",
    message: "my message",
    status: 400,
    cause: new Error("Bad"),
    meta: { username: "fred" }
  });
  const remoteError = RemoteError(error.getResponse());

  it("is instanceof Error", () => {
    expect(error instanceof Error).toBeTruthy();
    expect(remoteError instanceof Error).toBeTruthy();
  });

  it("has the name UserExists", () => {
    expect(error.name).toEqual("UserExists");
    expect(remoteError.name).toEqual("UserExists");
  });

  it("has isAppError property", () => {
    expect(error.isAppError).toBeTruthy();
    expect(remoteError.isAppError).toBeTruthy();
  });

  it("is expected", () => {
    expect(error.isExpected).toBeTruthy();
    expect(remoteError.isExpected).toBeTruthy();
  });

  it("has response property", () => {
    const expected = {
      name: "UserExists",
      message: "my message",
      status: 400,
      isAppError: true,
      isExpected: true,
      meta: { username: "fred" }
    };
    expect(error.getResponse()).toEqual(expected);
    expect(remoteError.getResponse()).toEqual(expected);
  });

  it("has cause", () => {
    expect(error.cause()).toEqual(new Error("Bad"));
    expect(/^\s*Error: Bad\s+at Suite/.test(error.cause().stack)).toBeTruthy();
  });
});

describe("AppError with message option only", () => {
  const error = AppError({ message: "my message" });
  const remoteError = RemoteError(error.getResponse());

  it("is instanceof Error", () => {
    expect(error instanceof Error).toBeTruthy();
    expect(remoteError instanceof Error).toBeTruthy();
  });

  it("has the name AppError", () => {
    expect(error.name).toEqual("AppError");
    expect(remoteError.name).toEqual("AppError");
  });

  it("has isAppError property", () => {
    expect(error.isAppError).toBeTruthy();
    expect(remoteError.isAppError).toBeTruthy();
  });

  it("is expected", () => {
    expect(error.isExpected).toBeFalsy();
    expect(remoteError.isExpected).toBeFalsy();
  });

  it("has response property", () => {
    const expected = {
      name: "AppError",
      message: "my message",
      status: 500,
      isAppError: true
    };
    expect(error.getResponse()).toEqual(expected);
    expect(remoteError.getResponse()).toEqual(expected);
  });
});

describe("AppError with message", () => {
  const error = AppError("my message");
  const remoteError = RemoteError(error.getResponse());

  it("is instanceof Error", () => {
    expect(error instanceof Error).toBeTruthy();
    expect(remoteError instanceof Error).toBeTruthy();
  });

  it("has the name Error", () => {
    expect(error.name).toEqual("Error");
    expect(remoteError.name).toEqual("Error");
  });

  it("has isAppError property", () => {
    expect(error.isAppError).toBeTruthy();
    expect(remoteError.isAppError).toBeTruthy();
  });

  it("is expected", () => {
    expect(error.isExpected).toBeFalsy();
    expect(remoteError.isExpected).toBeFalsy();
  });

  it("has response property", () => {
    const expected = {
      name: "Error",
      message: "my message",
      status: 500,
      isAppError: true
    };
    expect(error.getResponse()).toEqual(expected);
    expect(remoteError.getResponse()).toEqual(expected);
  });
});

describe("AppError with name and message", () => {
  const error = AppError("UserExists", "my message");
  const remoteError = RemoteError(error.getResponse());

  it("is instanceof Error", () => {
    expect(error instanceof Error).toBeTruthy();
    expect(remoteError instanceof Error).toBeTruthy();
  });

  it("has the name UserExists", () => {
    expect(error.name).toEqual("UserExists");
    expect(remoteError.name).toEqual("UserExists");
  });

  it("has isAppError property", () => {
    expect(error.isAppError).toBeTruthy();
    expect(remoteError.isAppError).toBeTruthy();
  });

  it("is expected", () => {
    expect(error.isExpected).toBeTruthy();
    expect(remoteError.isExpected).toBeTruthy();
  });

  it("has response property", () => {
    const expected = {
      name: "UserExists",
      message: "my message",
      status: 500,
      isAppError: true,
      isExpected: true
    };
    expect(error.getResponse()).toEqual(expected);
    expect(remoteError.getResponse()).toEqual(expected);
  });
});

describe("AppError with name and error", () => {
  const error = AppError("UserExists", new Error("my message"));
  const remoteError = RemoteError(error.getResponse());

  it("is instanceof Error", () => {
    expect(error instanceof Error).toBeTruthy();
    expect(remoteError instanceof Error).toBeTruthy();
  });

  it("has the name UserExists", () => {
    expect(error.name).toEqual("UserExists");
    expect(remoteError.name).toEqual("UserExists");
  });

  it("has isAppError property", () => {
    expect(error.isAppError).toBeTruthy();
    expect(remoteError.isAppError).toBeTruthy();
  });

  it("has isRemoteError property", () => {
    expect(error.isRemoteError).toBeFalsy();
    expect(remoteError.isRemoteError).toBeTruthy();
  });

  it("is expected", () => {
    expect(error.isExpected).toBeTruthy();
    expect(remoteError.isExpected).toBeTruthy();
  });

  it("has response property", () => {
    const expected = {
      name: "UserExists",
      message: "my message",
      status: 500,
      isAppError: true,
      isExpected: true
    };
    expect(error.getResponse()).toEqual(expected);
    expect(remoteError.getResponse()).toEqual(expected);
  });

  it("has cause", () => {
    expect(error.cause()).toEqual(new Error("my message"));
    expect(
      /^\s*Error: my message\s+at Suite/.test(error.cause().stack)
    ).toBeTruthy();
  });
});

describe("MyError with options", () => {
  const error = MyError({
    message: "my message",
    status: 400,
    cause: new Error("Bad")
  });
  const remoteError = RemoteError(error.getResponse());

  it("is instanceof Error", () => {
    expect(error instanceof Error).toBeTruthy();
    expect(remoteError instanceof Error).toBeTruthy();
  });

  it("has the name MyError", () => {
    expect(error.name).toEqual("MyError");
    expect(remoteError.name).toEqual("MyError");
  });

  it("has isAppError property", () => {
    expect(error.isAppError).toBeTruthy();
    expect(remoteError.isAppError).toBeTruthy();
  });

  it("is expected", () => {
    expect(error.isExpected).toBeTruthy();
    expect(remoteError.isExpected).toBeTruthy();
  });

  it("has response property", () => {
    const expected = {
      name: "MyError",
      message: "my message",
      status: 400,
      isAppError: true,
      isExpected: true
    };
    expect(error.getResponse()).toEqual(expected);
    expect(remoteError.getResponse()).toEqual(expected);
  });

  it("has cause", () => {
    expect(error.cause()).toEqual(new Error("Bad"));
    expect(/^\s*Error: Bad\s+at Suite/.test(error.cause().stack)).toBeTruthy();
  });
});
