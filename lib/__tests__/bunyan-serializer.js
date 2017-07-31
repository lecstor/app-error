const AppError = require("../index");
const { bunyanSerializer } = require("../index");
const bunyan = require("bunyan");

const buffer = new bunyan.RingBuffer({ limit: 10 });

const logger = bunyan.createLogger({
  name: "test",
  streams: [{ level: "info", type: "raw", stream: buffer }],
  serializers: { err: bunyanSerializer }
});

beforeEach(() => (buffer.records = []));

describe("Bunyan Serializer", () => {
  it("logs an AppError", () => {
    const error = AppError();
    logger.info({ err: error });
    const record = buffer.records[0];
    expect(record.name).toEqual("test");
    expect(record.hostname).toBeTruthy();
    expect(record.pid).toBeTruthy();
    expect(record.level).toEqual(30);
    expect(record.msg).toEqual("Server Error");
    expect(record.time).toBeTruthy();

    const err = record.err;
    expect(err.message).toEqual("Server Error");
    expect(err.name).toEqual("AppError");
    expect(err.stack).toBeTruthy();
    expect(err.code).toBeUndefined();
    expect(err.signal).toBeUndefined();
    expect(err.status).toEqual(500);
    expect(err.meta).toBeUndefined();
    expect(err.isRemoteError).toBeUndefined();
  });

  it("logs an AppError with name and opts", () => {
    const error = AppError("UserExists", {
      message: "my message",
      status: 400,
      code: 4321,
      cause: new Error("Bad"),
      meta: { username: "fred" }
    });
    logger.error({ err: error });
    const record = buffer.records[0];
    expect(record.name).toEqual("test");
    expect(record.hostname).toBeTruthy();
    expect(record.pid).toBeTruthy();
    expect(record.level).toEqual(50);
    expect(record.msg).toEqual("my message");
    expect(record.time).toBeTruthy();

    const err = record.err;
    expect(err.message).toEqual("my message");
    expect(err.name).toEqual("UserExists");
    expect(err.stack).toBeFalsy();
    expect(err.code).toEqual(4321);
    expect(err.signal).toBeUndefined();
    expect(err.status).toEqual(400);
    expect(err.meta).toEqual({ username: "fred" });
    expect(err.isRemoteError).toBeUndefined();
  });

  it("logs an AppError with error", () => {
    const error = AppError(new Error("Bad Things"));
    logger.error({ err: error });
    const record = buffer.records[0];
    expect(record.name).toEqual("test");
    expect(record.hostname).toBeTruthy();
    expect(record.pid).toBeTruthy();
    expect(record.level).toEqual(50);
    expect(record.msg).toEqual("Bad Things");
    expect(record.time).toBeTruthy();

    const err = record.err;
    expect(err.message).toEqual("Bad Things");
    expect(err.name).toEqual("Error");
    expect(err.stack.startsWith("Error: Bad Things")).toBe(true);
    expect(err.code).toBeUndefined();
    expect(err.signal).toBeUndefined();
    expect(err.status).toEqual(500);
    expect(err.meta).toBeUndefined();
    expect(err.isRemoteError).toBeUndefined();
  });

  it("logs an AppError with nested errors", () => {
    const error = AppError({
      cause: AppError({ cause: AppError(new Error("Bad Things")) })
    });
    logger.error({ err: error });
    const record = buffer.records[0];
    expect(record.name).toEqual("test");
    expect(record.hostname).toBeTruthy();
    expect(record.pid).toBeTruthy();
    expect(record.level).toEqual(50);
    expect(record.msg).toEqual("");
    expect(record.time).toBeTruthy();

    const err = record.err;
    expect(err.message).toEqual("");
    expect(err.name).toEqual("AppError");
    expect(err.stack.startsWith("AppError")).toBe(true);
    expect(err.code).toBeUndefined();
    expect(err.signal).toBeUndefined();
    expect(err.status).toEqual(500);
    expect(err.meta).toBeUndefined();
    expect(err.isRemoteError).toBeUndefined();
  });
});
