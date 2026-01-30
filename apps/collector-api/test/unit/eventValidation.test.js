const { validateEventPayload } = require("../../src/services/eventValidation");

describe("validateEventPayload", () => {
  test("accepts a valid payload", () => {
    const payload = { userId: "u1", sessionId: "s1", eventType: "PAGE_VIEW" };
    expect(validateEventPayload(payload)).toEqual({ ok: true });
  });

  test("rejects missing fields", () => {
    const payload = { userId: "u1" };
    expect(validateEventPayload(payload).ok).toBe(false);
  });

  test("rejects non-object metadata", () => {
    const payload = {
      userId: "u1",
      sessionId: "s1",
      eventType: "PAGE_VIEW",
      metadata: "bad",
    };
    expect(validateEventPayload(payload).ok).toBe(false);
  });
});
