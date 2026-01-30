function validateEventPayload(body) {
  if (!body || typeof body !== "object") return { ok: false };

  const required = ["userId", "sessionId", "eventType"];
  for (const key of required) {
    if (typeof body[key] !== "string" || body[key].trim() === "") {
      return { ok: false, reason: `Invalid ${key}` };
    }
  }

  if (body.metadata !== undefined && typeof body.metadata !== "object") {
    return { ok: false, reason: "Invalid metadata" };
  }

  return { ok: true };
}

module.exports = { validateEventPayload };
