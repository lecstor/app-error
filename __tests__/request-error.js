const supertest = require("supertest");
const nock = require("nock");

const app = require("../lib/app");

describe("Request error handling", () => {
  test("", () => {
    nock("http://localhost:4321").post("/new-user").replyWithError({
      name: "UserExists",
      message: "my message",
      status: 400,
      isAppError: true,
      meta: { username: "fred" }
    });
    return supertest(app).post("/create-user").then(resp => {
      // expect(resp).toEqual({
      //   header: {
      //     connection: "close",
      //     "content-length": "102",
      //     "content-type": "application/json; charset=utf-8",
      //     date: "Sun, 30 Jul 2017 14:05:44 GMT",
      //     etag: 'W/"66-D6gVA6zQ9tE2cPudXKPJJHUNbm4"',
      //     "x-powered-by": "Express"
      //   },
      //   req: {
      //     data: undefined,
      //     headers: { "user-agent": "node-superagent/3.5.2" },
      //     method: "POST",
      //     url: "http://127.0.0.1:52195/create-user"
      //   },
      //   status: 500,
      //   text:
      //     '{"name":"UserExists","message":"my message","status":500,"meta":{"username":"fred"},"isAppError":true}'
      // });
      const { header, req, status, text } = resp;
      expect(JSON.parse(text)).toEqual({
        isAppError: true,
        message: "my message",
        meta: { username: "fred" },
        name: "UserExists",
        status: 400
      });
    });
  });
});
