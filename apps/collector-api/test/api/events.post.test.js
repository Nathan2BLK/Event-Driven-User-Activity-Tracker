const request = require("supertest");
const { createApp } = require("../../src/app");
const { getPool } = require("../../src/db/postgres");

describe("POST /events", () => {
  const app = createApp();

  beforeAll(async () => {
    // sanity check DB connectivity
    await getPool().query("SELECT 1");
  });

  afterAll(async () => {
    // close pool so Jest exits cleanly
    await getPool().end();
  });

  test("returns 201 and stores event for a valid payload", async () => {
    const payload = {
      userId: "u_test",
      sessionId: "s_test",
      eventType: "PAGE_VIEW",
      metadata: { path: "/home" },
    };

    const res = await request(app).post("/events").send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe("stored");
    expect(typeof res.body.eventId).toBe("string");
    expect(res.body.eventId.length).toBeGreaterThan(10);
  });

  test("returns 400 for invalid payload", async () => {
    const payload = { userId: "u_test" };

    const res = await request(app).post("/events").send(payload);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Invalid payload");
  });
});
