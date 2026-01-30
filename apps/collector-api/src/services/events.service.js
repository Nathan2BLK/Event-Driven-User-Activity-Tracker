const crypto = require("crypto");
const { query } = require("../db/postgres");

function normalizeEvent(input) {
  return {
    id: crypto.randomUUID(),
    timestamp: input.timestamp ? new Date(input.timestamp) : new Date(),
    userId: input.userId,
    sessionId: input.sessionId,
    eventType: input.eventType,
    source: input.source ?? null,
    metadata: input.metadata ?? {},
  };
}

async function insertEvent(evt) {
  const sql = `
    INSERT INTO events (id, timestamp, user_id, session_id, event_type, source, metadata)
    VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)
  `;
  await query(sql, [
    evt.id,
    evt.timestamp,
    evt.userId,
    evt.sessionId,
    evt.eventType,
    evt.source,
    JSON.stringify(evt.metadata),
  ]);
}

const eventsService = {
  acceptEvent: async (eventInput) => {
    const evt = normalizeEvent(eventInput);
    await insertEvent(evt);
    return evt.id;
  },
};

module.exports = { eventsService };
